import {existsSync, readFileSync} from 'node:fs';
import {join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {listMarkdownFiles} from './validate-i18n.mjs';

const siteDir = fileURLToPath(new URL('../', import.meta.url));
const baseUrl = '/Sporttech-Certificate-Tools-Docs/';

function attributeValue(tag, name) {
  // Docusaurus may minify away attribute quotes in production HTML.
  const pattern = new RegExp(`\\b${name}\\s*=\\s*(?:"([^"]*)"|'([^']*)'|([^\\s"'=<>\\x60]+))`, 'i');
  const match = tag.match(pattern);
  return match?.[1] ?? match?.[2] ?? match?.[3];
}

function findHtml(buildDir, route) {
  return [join(buildDir, route, 'index.html'), join(buildDir, `${route}.html`)]
    .find((path) => existsSync(path));
}

// This is an output smoke check, not a browser test. Run after a build of BOTH locales.
export function validateI18nBuild(root = siteDir) {
  const errors = [];
  const buildDir = join(root, 'build');
  const docs = listMarkdownFiles(join(root, 'docs'));
  if (!docs.length) throw new Error('No source documents found. Run in the complete repository.');
  let pages = 0;
  let mediaReferences = 0;
  for (const locale of ['en', 'de']) {
    const prefix = locale === 'de' ? 'de/' : '';
    const routes = ['', ...docs.map((path) => {
      const text = readFileSync(join(root, 'docs', path), 'utf8');
      const slug = text.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1]
        .match(/^slug:\s*([^\r\n]+)$/m)?.[1]?.trim().replace(/^['"]|['"]$/g, '');
      return `docs/${(slug ?? path.replace(/\.mdx?$/, '')).replace(/^\//, '')}`;
    })];
    for (const route of routes) {
      const relativeRoute = `${prefix}${route}`;
      const path = findHtml(buildDir, relativeRoute);
      if (!path) { errors.push(`Missing ${locale} output: ${relativeRoute || '/'}`); continue; }
      pages += 1;
      const html = readFileSync(path, 'utf8');
      const title = html.match(/<title\b[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '';
      if (/\{\/\*\s*#[^}]+\*\/\}/.test(title)) {
        errors.push(`${relativeRoute || '/'}: heading ID markup leaked into the page title; set an explicit localized front-matter title.`);
      }
      if (attributeValue(html.match(/<html\b[^>]*>/i)?.[0] ?? '', 'lang') !== locale) {
        errors.push(`${relativeRoute || '/'}: wrong or missing HTML language.`);
      }
      if (!route) {
        const message = locale === 'de' ? 'Dokumentation öffnen' : 'Open the documentation';
        if (!html.includes(message)) errors.push(`${locale} homepage: missing localized documentation button.`);
        if (!html.includes(`${baseUrl}${prefix}docs/intro`)) errors.push(`${locale} homepage: missing localized intro link.`);
        if (!html.includes('Deutsch') || !html.includes('English')) errors.push(`${locale} homepage: missing language menu labels.`);
      }
      // Shared root media and locale-prefixed useBaseUrl() media must both exist.
      for (const tag of html.matchAll(/<(?:img|source|video)\b[^>]*>/gi)) {
        for (const name of ['src', 'poster']) {
          const value = attributeValue(tag[0], name);
          if (!value) continue;
          const source = value.replace(/&amp;/g, '&');
          const url = new URL(source, `https://docs.invalid${baseUrl}${relativeRoute}`);
          if (url.origin !== 'https://docs.invalid' || !url.pathname.startsWith(baseUrl)) continue;
          const localPath = decodeURIComponent(url.pathname.slice(baseUrl.length));
          mediaReferences += 1;
          if (!existsSync(join(buildDir, localPath))) errors.push(`${relativeRoute || '/'}: missing media ${url.pathname}`);
        }
      }
    }
  }
  if (errors.length) throw new Error(`Bilingual output validation failed:\n${errors.map((error) => `- ${error}`).join('\n')}\nRun npm run build without --locale before this check.`);
  return {pages, mediaReferences};
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  try {
    const result = validateI18nBuild();
    console.log(`Bilingual build OK: ${result.pages} English/German pages and ${result.mediaReferences} local media references checked.`);
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}
