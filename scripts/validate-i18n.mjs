import {existsSync, readFileSync, readdirSync, statSync} from 'node:fs';
import {dirname, join, relative, resolve} from 'node:path';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

// TypeScript is already a direct devDependency; no new packages are needed.
const require = createRequire(import.meta.url);
const ts = require('typescript');
const siteDir = fileURLToPath(new URL('../', import.meta.url));
const translationPath = 'i18n/de/docusaurus-plugin-content-docs/current';

export function listMarkdownFiles(directory, prefix = '') {
  if (!existsSync(directory)) return [];
  return readdirSync(directory, {withFileTypes: true}).flatMap((entry) => {
    const name = prefix ? `${prefix}/${entry.name}` : entry.name;
    if (entry.name.startsWith('_') || entry.name.startsWith('.')) return [];
    if (entry.isDirectory()) return listMarkdownFiles(join(directory, entry.name), name);
    return entry.isFile() && /\.mdx?$/.test(entry.name) ? [name] : [];
  }).sort();
}

function withoutFences(text) {
  return text.replace(/^(`{3,}|~{3,})[^\n]*\n[\s\S]*?^\1\s*$/gm, '');
}

export function headingIds(text) {
  const counts = new Map();
  return [...withoutFences(text).matchAll(/^#{1,6}\s+(.+)$/gm)].map((match) => {
    const explicit = match[1].match(/\{\/\*\s*#([^\s*}]+)\s*\*\/\}\s*$/)
      ?? match[1].match(/\{#([^}]+)\}\s*$/);
    if (explicit) return explicit[1];
    // Current English headings are plain-text ATX headings. Keep explicit IDs
    // for future headings containing complex Markdown, and in translations.
    const slug = match[1].toLowerCase().replace(/[^\p{L}\p{N}_\s-]/gu, '').replace(/\s/g, '-');
    const count = counts.get(slug) ?? 0;
    counts.set(slug, count + 1);
    return count ? `${slug}-${count}` : slug;
  });
}

function frontMatter(text) {
  const block = text.match(/^---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/)?.[1] ?? '';
  return Object.fromEntries([...block.matchAll(/^(id|slug|sidebar_position):\s*(.*?)\s*$/gm)].map((m) => [m[1], m[2]]));
}

function visit(node, callback) {
  callback(node);
  ts.forEachChild(node, (child) => visit(child, callback));
}

function unwrap(node) {
  while (node && (ts.isSatisfiesExpression(node) || ts.isAsExpression(node) || ts.isParenthesizedExpression(node))) node = node.expression;
  return node;
}

function property(object, name) {
  object = unwrap(object);
  if (!object || !ts.isObjectLiteralExpression(object)) return undefined;
  return object.properties.find((p) => ts.isPropertyAssignment(p) && p.name?.text === name)?.initializer;
}

function string(node) {
  return node && (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) ? node.text : undefined;
}

function elements(node) {
  node = unwrap(node);
  return node && ts.isArrayLiteralExpression(node) ? [...node.elements] : [];
}

function placeholders(message) {
  return [...message.matchAll(/\{([\w]+)\}/g)].map((m) => m[1]).sort();
}

export function validateI18n(root = siteDir) {
  const errors = [];
  const check = (condition, message) => { if (!condition) errors.push(message); };
  const read = (path) => readFileSync(join(root, path), 'utf8');
  const sourceFiles = listMarkdownFiles(join(root, 'docs'));
  const translatedFiles = listMarkdownFiles(join(root, translationPath));
  check(sourceFiles.length > 0, 'No English documentation found. Run this in the full repository.');
  check(JSON.stringify(sourceFiles) === JSON.stringify(translatedFiles),
    `Document coverage differs. Missing: ${sourceFiles.filter((p) => !translatedFiles.includes(p)).join(', ') || 'none'}; orphaned: ${translatedFiles.filter((p) => !sourceFiles.includes(p)).join(', ') || 'none'}`);
  let anchors = 0;
  for (const path of sourceFiles) {
    if (!translatedFiles.includes(path)) continue;
    const en = read(`docs/${path}`);
    const de = read(`${translationPath}/${path}`);
    check(!/^#{1,6}\s+.*\{#[^}]+\}\s*$/m.test(withoutFences(de)), `${path}: use MDX comment heading IDs; classic {#id} syntax is incompatible with future.v4.`);
    check(JSON.stringify(frontMatter(en)) === JSON.stringify(frontMatter(de)), `${path}: id, slug or sidebar_position differs.`);
    const enIds = headingIds(en);
    check(JSON.stringify(enIds) === JSON.stringify(headingIds(de)), `${path}: headings or stable anchor IDs differ.`);
    anchors += enIds.length;
    const inlineCode = (text) => [...withoutFences(text).matchAll(/`([^`\n]+)`/g)].map((m) => m[1]);
    check(JSON.stringify(inlineCode(en)) === JSON.stringify(inlineCode(de)), `${path}: technical inline code differs.`);
    const codeBlocks = (text) => text.match(/^```[^\n]*\n[\s\S]*?^```\s*$/gm) ?? [];
    check(JSON.stringify(codeBlocks(en)) === JSON.stringify(codeBlocks(de)), `${path}: code examples differ.`);
    const media = (text) => [...text.matchAll(/\b(?:src|poster)="([^"]+)"/g)].map((m) => m[1]);
    check(JSON.stringify(media(en)) === JSON.stringify(media(de)), `${path}: shared media paths differ.`);
    check(!/\b(?:TODO|TRANSLATE_ME)\b/.test(de), `${path}: unfinished translation marker.`);
    for (const match of de.matchAll(/!?\[[^\]]*\]\(([^\s)]+)(?:\s+"[^"]*")?\)/g)) {
      const target = match[1];
      if (/^(?:[a-z]+:|\/\/)/i.test(target)) continue;
      if (target.startsWith('/')) {
        check(!target.startsWith('/docs/') && !target.startsWith('/Sporttech-Certificate-Tools-Docs/docs/'), `${path}: use a relative Markdown link to keep the current locale: ${target}`);
        continue;
      }
      const [file, fragment] = target.split('#');
      const absolute = file ? resolve(root, translationPath, dirname(path), decodeURIComponent(file)) : resolve(root, translationPath, path);
      const local = relative(resolve(root, translationPath), absolute);
      check(!local.startsWith('..'), `${path}: link escapes the translated docs: ${target}`);
      check(existsSync(absolute) && statSync(absolute).isFile(), `${path}: missing relative link target: ${target}`);
      if (fragment && existsSync(absolute)) check(headingIds(readFileSync(absolute, 'utf8')).includes(decodeURIComponent(fragment)), `${path}: missing link anchor: ${target}`);
    }
  }
  const readTranslations = (path) => {
    let data;
    try { data = JSON.parse(read(path)); } catch (error) { errors.push(`${path}: ${error.message}`); return {}; }
    check(data !== null && typeof data === 'object' && !Array.isArray(data), `${path}: expected a message map.`);
    if (!data || typeof data !== 'object' || Array.isArray(data)) return {};
    for (const [id, entry] of Object.entries(data)) check(typeof entry?.message === 'string' && entry.message.trim().length > 0, `${path}: empty or invalid message ${id}`);
    return data;
  };
  const code = readTranslations('i18n/de/code.json');
  const sidebar = readTranslations('i18n/de/docusaurus-plugin-content-docs/current.json');
  const navbar = readTranslations('i18n/de/docusaurus-theme-classic/navbar.json');
  const footer = readTranslations('i18n/de/docusaurus-theme-classic/footer.json');
  const parse = (path, kind = ts.ScriptKind.TS) => {
    const parsed = ts.createSourceFile(path, read(path), ts.ScriptTarget.Latest, true, kind);
    for (const diagnostic of parsed.parseDiagnostics) errors.push(`${path}: ${ts.flattenDiagnosticMessageText(diagnostic.messageText, '\n')}`);
    return parsed;
  };
  const homepage = parse('src/pages/index.tsx', ts.ScriptKind.TSX);
  const messageIds = new Set();
  visit(homepage, (node) => {
    if (!ts.isCallExpression(node) || !ts.isIdentifier(node.expression) || node.expression.text !== 'translate') return;
    const id = string(property(node.arguments[0], 'id'));
    const message = string(property(node.arguments[0], 'message'));
    check(Boolean(id && message), 'Homepage translate() needs a literal id and English message.');
    if (!id || !message) return;
    messageIds.add(id);
    check(typeof code[id]?.message === 'string', `Missing German homepage message: ${id}`);
    if (typeof code[id]?.message === 'string') check(JSON.stringify(placeholders(message)) === JSON.stringify(placeholders(code[id].message)), `${id}: interpolation placeholders differ.`);
  });
  check(messageIds.size > 0, 'No translatable homepage messages found.');
  for (const id of Object.keys(code).filter((id) => id.startsWith('homepage.'))) check(messageIds.has(id), `Orphaned homepage message: ${id}`);
  visit(parse('sidebars.ts'), (node) => {
    if (ts.isObjectLiteralExpression(node) && string(property(node, 'type')) === 'category') {
      const label = string(property(node, 'label'));
      check(Boolean(sidebar[`sidebar.userGuide.category.${label}`]?.message), `Missing sidebar category: ${label}`);
    }
  });
  let config;
  visit(parse('docusaurus.config.ts'), (node) => {
    if (ts.isVariableDeclaration(node) && ts.isIdentifier(node.name) && node.name.text === 'config') config = unwrap(node.initializer);
  });
  check(Boolean(config), 'Cannot find the static Docusaurus config.');
  const i18n = property(config, 'i18n');
  check(string(property(i18n, 'defaultLocale')) === 'en', 'English must remain the default locale.');
  const locales = elements(property(i18n, 'locales')).map(string);
  check(locales.includes('en') && locales.includes('de'), 'Both en and de must be enabled.');
  const theme = property(config, 'themeConfig');
  const nav = property(theme, 'navbar');
  const navItems = elements(property(nav, 'items'));
  check(navItems.some((item) => string(property(item, 'type')) === 'localeDropdown'), 'Missing localeDropdown.');
  for (const item of navItems) {
    const label = string(property(item, 'label'));
    if (label) check(Boolean(navbar[`item.label.${label}`]?.message), `Missing navbar label: ${label}`);
  }
  for (const group of elements(property(property(theme, 'footer'), 'links'))) {
    const title = string(property(group, 'title'));
    check(Boolean(footer[`link.title.${title}`]?.message), `Missing footer title: ${title}`);
    for (const item of elements(property(group, 'items'))) {
      const label = string(property(item, 'label'));
      check(Boolean(footer[`link.item.label.${label}`]?.message), `Missing footer link: ${label}`);
    }
  }
  check(Boolean(footer.copyright?.message), 'Missing German footer copyright.');
  const preset = elements(property(config, 'presets')).map(elements).find((items) => string(items[0]) === 'classic');
  check(property(property(preset?.[1], 'docs'), 'editLocalizedFiles')?.kind === ts.SyntaxKind.TrueKeyword, 'Edit links must target translated files.');
  if (errors.length) throw new Error(`Localization validation failed:\n${errors.map((message) => `- ${message}`).join('\n')}`);
  return {documents: sourceFiles.length, homepageMessages: messageIds.size, stableAnchors: anchors};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = validateI18n();
    console.log(`i18n OK: ${result.documents} German documents, ${result.homepageMessages} homepage messages, ${result.stableAnchors} stable anchors; routes, code examples, media, navigation and placeholders checked.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
