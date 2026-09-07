import assert from 'node:assert/strict';
import {cpSync, existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {dirname, join} from 'node:path';
import {fileURLToPath} from 'node:url';
import test from 'node:test';
import {headingIds, listMarkdownFiles, validateI18n} from './validate-i18n.mjs';
import {validateI18nBuild} from './validate-i18n-build.mjs';

const source = fileURLToPath(new URL('../', import.meta.url));
const de = 'i18n/de/docusaurus-plugin-content-docs/current';

function fixture(t) {
  const root = mkdtempSync(join(tmpdir(), 'sporttech-i18n-'));
  t.after(() => rmSync(root, {recursive: true, force: true}));
  for (const path of ['docs', 'i18n', 'src/pages', 'docusaurus.config.ts', 'sidebars.ts']) {
    mkdirSync(dirname(join(root, path)), {recursive: true});
    cpSync(join(source, path), join(root, path), {recursive: true});
  }
  return root;
}

function edit(root, path, transform) {
  writeFileSync(join(root, path), transform(readFileSync(join(root, path), 'utf8')));
}

function editJson(root, path, transform) {
  edit(root, path, (text) => {
    const data = JSON.parse(text);
    transform(data);
    return JSON.stringify(data, null, 2);
  });
}

test('complete localization passes', () => {
  const result = validateI18n(source);
  assert.equal(result.documents, listMarkdownFiles(join(source, 'docs')).length);
  assert.ok(result.homepageMessages > 0);
  assert.ok(result.stableAnchors >= result.documents);
});

test('missing German document is rejected', (t) => {
  const root = fixture(t);
  rmSync(join(root, de, 'intro.md'));
  assert.throws(() => validateI18n(root), /Document coverage differs/);
});

test('missing homepage translation is rejected', (t) => {
  const root = fixture(t);
  editJson(root, 'i18n/de/code.json', (data) => { delete data['homepage.openDocs']; });
  assert.throws(() => validateI18n(root), /Missing German homepage message/);
});

test('changed interpolation variables are rejected', (t) => {
  const root = fixture(t);
  edit(root, 'i18n/de/code.json', (text) => text.replace('{total}', '{wrongTotal}'));
  assert.throws(() => validateI18n(root), /interpolation placeholders differ/);
});

test('changed document slug is rejected', (t) => {
  const root = fixture(t);
  edit(root, `${de}/intro.md`, (text) => text.replace('slug: /intro', 'slug: /einfuehrung'));
  assert.throws(() => validateI18n(root), /id, slug or sidebar_position differs/);
});

test('missing stable heading anchor is rejected', (t) => {
  const root = fixture(t);
  edit(root, `${de}/intro.md`, (text) => text.replace(' {/* #what-the-app-is-for */}', ''));
  assert.throws(() => validateI18n(root), /stable anchor IDs differ/);
});

test('changed technical value is rejected', (t) => {
  const root = fixture(t);
  edit(root, `${de}/event/offline-ovs.md`, (text) => text.replace('`9002`', '`9003`'));
  assert.throws(() => validateI18n(root), /technical inline code differs/);
});

test('changed shared media path is rejected', (t) => {
  const root = fixture(t);
  edit(root, `${de}/intro.md`, (text) => text.replace('produce-preview.png', 'missing.png'));
  assert.throws(() => validateI18n(root), /shared media paths differ/);
});

test('broken relative document link is rejected', (t) => {
  const root = fixture(t);
  edit(root, `${de}/intro.md`, (text) => text.replace('./getting-started/installing-beta.md', './missing.md'));
  assert.throws(() => validateI18n(root), /missing relative link target/);
});

test('missing navigation translation is rejected', (t) => {
  const root = fixture(t);
  editJson(root, 'i18n/de/docusaurus-theme-classic/navbar.json', (data) => { delete data['item.label.User Guide']; });
  assert.throws(() => validateI18n(root), /Missing navbar label/);
});

test('heading extraction ignores code samples and keeps explicit anchors', () => {
  assert.deepEqual(headingIds('# Hello\n## Repeat\n## Repeat\n```md\n# Not a heading\n```\n## Deutsch {/* #english */}\n## Legacy {#legacy}\n'), ['hello', 'repeat', 'repeat-1', 'english', 'legacy']);
});

test('legacy heading IDs incompatible with future.v4 are rejected', (t) => {
  const root = fixture(t);
  edit(root, `${de}/intro.md`, (text) => text.replace(' {/* #what-the-app-is-for */}', ' {#what-the-app-is-for}'));
  assert.throws(() => validateI18n(root), /use MDX comment heading IDs/);
});

// Synthetic HTML fixtures test the validator itself; they are NOT a Docusaurus build.
function fakeBuild(root) {
  const routes = ['', ...listMarkdownFiles(join(root, 'docs')).map((p) => `docs/${p.replace(/\.mdx?$/, '')}`)];
  for (const locale of ['en', 'de']) {
    const prefix = locale === 'de' ? 'de/' : '';
    for (const route of routes) {
      const path = join(root, 'build', prefix, route, 'index.html');
      mkdirSync(dirname(path), {recursive: true});
      writeFileSync(path, `<html lang="${locale}"><body>English Deutsch ${locale === 'de' ? 'Dokumentation öffnen' : 'Open the documentation'}<a href="/Sporttech-Certificate-Tools-Docs/${prefix}docs/intro">Docs</a><img src="/Sporttech-Certificate-Tools-Docs/img/example.svg" /></body></html>`);
    }
  }
  const image = join(root, 'build/img/example.svg');
  mkdirSync(dirname(image), {recursive: true});
  writeFileSync(image, '<svg xmlns="http://www.w3.org/2000/svg"/>');
}

test('build validator accepts synthetic bilingual output', (t) => {
  const root = fixture(t);
  fakeBuild(root);
  const result = validateI18nBuild(root);
  assert.equal(result.pages, 2 * (listMarkdownFiles(join(root, 'docs')).length + 1));
  assert.equal(result.mediaReferences, result.pages);
});

test('build validator rejects a missing localized page', (t) => {
  const root = fixture(t);
  fakeBuild(root);
  rmSync(join(root, 'build/de/docs/intro/index.html'));
  assert.throws(() => validateI18nBuild(root), /Missing de output/);
});

test('build validator rejects the wrong document language', (t) => {
  const root = fixture(t);
  fakeBuild(root);
  edit(root, 'build/de/index.html', (text) => text.replace('lang="de"', 'lang="en"'));
  assert.throws(() => validateI18nBuild(root), /wrong or missing HTML language/);
});

test('build validator rejects missing shared media', (t) => {
  const root = fixture(t);
  fakeBuild(root);
  assert.ok(existsSync(join(root, 'build/img/example.svg')));
  rmSync(join(root, 'build/img/example.svg'));
  assert.throws(() => validateI18nBuild(root), /missing media/);
});

test('build validator accepts minified unquoted HTML attributes', (t) => {
  const root = fixture(t);
  fakeBuild(root);
  edit(root, 'build/de/index.html', (text) => text.replace('lang="de"', 'lang=de').replace('src="/Sporttech-Certificate-Tools-Docs/img/example.svg"', 'src=/Sporttech-Certificate-Tools-Docs/img/example.svg'));
  const result = validateI18nBuild(root);
  assert.equal(result.mediaReferences, result.pages);
});

test('build validator accepts flat HTML document output', (t) => {
  const root = fixture(t);
  fakeBuild(root);
  const path = join(root, 'build/de/docs/intro/index.html');
  cpSync(path, join(root, 'build/de/docs/intro.html'));
  rmSync(path);
  assert.ok(validateI18nBuild(root).pages > 0);
});
