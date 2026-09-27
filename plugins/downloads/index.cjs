const {readFileSync} = require('node:fs');
const path = require('node:path');
const {verify} = require('node:crypto');

function readDownloads(envelope, trustedKeys) {
  if (envelope?.schemaVersion !== 1 || typeof envelope.payload !== 'string' || envelope.payload.length > 24576
      || !Array.isArray(envelope.signatures)) throw new Error('Invalid desktop download feed.');
  const bytes = Buffer.from(envelope.payload, 'base64');
  if (bytes.toString('base64') !== envelope.payload || !envelope.signatures.some((item) => {
    const key = trustedKeys.find((entry) => entry.keyId === item?.keyId);
    return key && typeof item.signature === 'string' && verify(null, bytes, key.publicKey, Buffer.from(item.signature, 'base64'));
  })) throw new Error('Desktop download signature verification failed.');
  const release = JSON.parse(bytes.toString('utf8'));
  if (release.product !== 'sporttech-certificate-tools' || release.channel !== 'beta'
      || !/^(0|[1-9]\d*)\.(0|[1-9]\d*)\.(0|[1-9]\d*)(?:-[0-9A-Za-z.-]+)?$/.test(release.version)
      || !Array.isArray(release.artifacts)) throw new Error('Unexpected desktop download release.');
  const releaseUrl = `https://github.com/Inominie/Sporttech-Certificate-Tools-Docs/releases/tag/desktop-v${release.version}`;
  const prefix = releaseUrl.replace('/tag/', '/download/') + '/';
  const installer = (platform, arch, kind) => {
    const matches = release.artifacts.filter((item) => item.platform === platform && item.arch === arch && item.kind === kind);
    const item = matches[0];
    if (matches.length !== 1 || typeof item.url !== 'string' || !item.url.startsWith(prefix)
        || !/^[A-Za-z0-9._-]+$/.test(item.url.slice(prefix.length)) || !item.url.endsWith(`.${kind}`)
        || !Number.isSafeInteger(item.size) || item.size <= 0) throw new Error(`Invalid ${platform} installer link.`);
    return {url: item.url, size: item.size};
  };
  return {version: release.version, releaseUrl,
    windows: installer('win32', 'x64', 'exe'), mac: installer('darwin', 'universal', 'dmg')};
}

module.exports = function downloadsPlugin(context) {
  const feedPath = path.join(context.siteDir, 'static/updates/desktop-beta.json');
  const keysPath = path.join(__dirname, 'public-keys.json');
  return {
    name: 'sporttech-downloads',
    getPathsToWatch: () => [feedPath, keysPath],
    loadContent: () => readDownloads(JSON.parse(readFileSync(feedPath, 'utf8')), JSON.parse(readFileSync(keysPath, 'utf8'))),
    contentLoaded: ({content, actions}) => actions.setGlobalData(content),
  };
};
module.exports.readDownloads = readDownloads;
