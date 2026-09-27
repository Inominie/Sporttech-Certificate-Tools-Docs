const {test} = require('node:test');
const assert = require('node:assert/strict');
const {generateKeyPairSync, sign} = require('node:crypto');
const {readFileSync} = require('node:fs');
const {readDownloads} = require('../plugins/downloads/index.cjs');

const {publicKey, privateKey} = generateKeyPairSync('ed25519');
const keys = [{keyId: 'fixture', publicKey}];
const release = {
  product: 'sporttech-certificate-tools', channel: 'beta', version: '1.2.3',
  artifacts: [
    {platform: 'win32', arch: 'x64', kind: 'exe', size: 100,
      url: 'https://github.com/Inominie/Sporttech-Certificate-Tools-Docs/releases/download/desktop-v1.2.3/windows.exe'},
    {platform: 'darwin', arch: 'universal', kind: 'dmg', size: 200,
      url: 'https://github.com/Inominie/Sporttech-Certificate-Tools-Docs/releases/download/desktop-v1.2.3/mac.dmg'},
  ],
};
function envelope(value) {
  const bytes = Buffer.from(JSON.stringify(value));
  return {schemaVersion: 1, payload: bytes.toString('base64'), signatures: [{keyId: 'fixture', signature: sign(null, bytes, privateKey).toString('base64')}]};
}

test('installer links follow the promoted version, not a hard-coded version or GitHub latest', () => {
  const result = readDownloads(envelope(release), keys);
  assert.equal(result.version, '1.2.3');
  assert.equal(result.windows.url, release.artifacts[0].url);
  assert.equal(result.mac.url, release.artifacts[1].url);
  assert.ok(result.releaseUrl.endsWith('/desktop-v1.2.3'));
});
test('invalid signature and unknown keys cannot create download buttons', () => {
  const tampered = envelope(release);
  tampered.payload = Buffer.from(JSON.stringify({...release, version: '1.2.4'})).toString('base64');
  assert.throws(() => readDownloads(tampered, keys), /signature/);
  assert.throws(() => readDownloads(envelope(release), []), /signature/);
  assert.throws(() => readDownloads({...envelope(release), schemaVersion: 2}, keys), /Invalid/);
});
test('missing/duplicate installers, wrong channel and unexpected download locations fail the build', () => {
  for (const value of [
    {...release, channel: 'stable'},
    {...release, artifacts: [release.artifacts[0]]},
    {...release, artifacts: [...release.artifacts, release.artifacts[0]]},
    {...release, artifacts: [{...release.artifacts[0], url: 'https://example.com/windows.exe'}, release.artifacts[1]]},
    {...release, artifacts: [{...release.artifacts[0], url: release.artifacts[0].url + '?redirect=1'}, release.artifacts[1]]},
    {...release, version: '1.2.4'},
  ]) assert.throws(() => readDownloads(envelope(value), keys));
});
test('the committed public feed is authenticated with the app public key', () => {
  const live = JSON.parse(readFileSync(new URL('../static/updates/desktop-beta.json', `file://${__filename}`), 'utf8'));
  const trusted = require('../plugins/downloads/public-keys.json');
  const result = readDownloads(live, trusted);
  assert.ok(result.windows.url.endsWith('.exe'));
  assert.ok(result.mac.url.endsWith('.dmg'));
});
