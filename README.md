# Sporttech Certificate Tools Docs

**Looking for the application? [Download the app for Windows or Mac](https://inominie.github.io/Sporttech-Certificate-Tools-Docs/download).**

[English](README.md) | [Deutsch](README.de.md)

User documentation for Sporttech Certificate Tools.

This site is built with [Docusaurus](https://docusaurus.io/) and published with GitHub Pages from the public repository `Inominie/Sporttech-Certificate-Tools-Docs`.

## Languages

English remains the default language at the existing URLs. German is available under `/de/`. Use the **English / Deutsch** menu in the navigation bar to switch languages.

- [English documentation](https://inominie.github.io/Sporttech-Certificate-Tools-Docs/)
- [German documentation](https://inominie.github.io/Sporttech-Certificate-Tools-Docs/de/)

Instructions use the corresponding app language's button names. Current screenshots use fictional data and are shared between languages with the English interface; descriptions and alternative text are translated. June 2026 videos are labelled historical on the homepage and no longer autoplay.

## Installation

Use Node.js 22, matching the deployment workflow, and install the locked dependencies from the complete repository:

```bash
npm ci
```

## Local development

```bash
npm run start
```

For German:

```bash
npm run start:de
```

This starts a local development server for one language. Most content changes are reflected live without restarting the server. To test switching between both languages, build and serve the complete site instead:

```bash
npm run build
npm run serve
```

## Translation maintenance

| Content | English source | German translation |
| --- | --- | --- |
| Documentation pages | `docs/` | `i18n/de/docusaurus-plugin-content-docs/current/` |
| Homepage and guided tours | `translate()` messages in `src/pages/index.tsx` | `i18n/de/code.json` |
| Sidebar categories | `sidebars.ts` | `i18n/de/docusaurus-plugin-content-docs/current.json` |
| Navigation and footer | `docusaurus.config.ts` | `i18n/de/docusaurus-theme-classic/` |

When adding or editing a page, update both languages. Keep matching relative file paths, document IDs, slugs, and explicit heading anchors. Write anchors as MDX comments such as `## Heading {/* #stable-id */}`; the site's `future.v4` configuration does not accept legacy `{#stable-id}` syntax. Set an explicit translated `title` in front matter so heading comments do not appear in page titles, sidebar labels, or breadcrumbs. Use relative Markdown links between translated pages so navigation stays in the selected language. Do not translate API identifiers, placeholder keys, code samples, file extensions, or source-data enum values.

New homepage messages must use a literal, stable `id` and an English default `message` in `translate()`. Translation files can be updated with:

```bash
npm run write-translations -- --locale de
```

Translate the newly added messages, then run the checks below. Docusaurus supplies its built-in German theme messages; only project-specific messages need to be maintained here. German edit links point to the translated source files rather than the English originals.

The source validator checks structural completeness, not whether a translation still reflects every later English wording change. Review both versions whenever content changes. The German footer intentionally omits the year to avoid freezing the dynamic English copyright year in a static JSON translation.

## Checks and build

```bash
npm run validate:i18n
npm run test:i18n
npm run typecheck
npm run build
npm run validate:i18n-build
```

`validate:i18n` checks page coverage, document metadata, stable anchors, technical literals, relative links, shared media paths, homepage interpolation variables, and navigation translations. It also runs automatically before `npm run build`.

`test:i18n` exercises the validators against valid and deliberately broken fixtures. Its HTML fixtures are synthetic; they do not replace a real Docusaurus build or browser test.

`npm run build` builds **both** languages into `build/`: English at the root and German in `build/de/`. `validate:i18n-build` then checks that both sets of HTML pages exist, their language attributes and homepage links are correct, and referenced local images and videos are present. Run it after the complete build, not after a single-locale build.

## Deployment

GitHub Pages is deployed by `.github/workflows/deploy-pages.yml` whenever `main` is pushed. The workflow installs dependencies, validates the update manifest, type-checks the site, builds both languages, checks the bilingual output, and publishes the `build` directory as a Pages artifact.

The production URL is configured as:

```text
https://inominie.github.io/Sporttech-Certificate-Tools-Docs/
```

The German site uses:

```text
https://inominie.github.io/Sporttech-Certificate-Tools-Docs/de/
```

## Installer download page

The permanent [download page](https://inominie.github.io/Sporttech-Certificate-Tools-Docs/download) gets its version and installer links from `static/updates/desktop-beta.json` at build time. `plugins/downloads` verifies the signature with the app's public updater keys before generating the page; invalid or incomplete metadata fails the build. Keep `plugins/downloads/public-keys.json` aligned with the application's trusted keys when rotating signing keys. Publishing the feed triggers Pages deployment and updates both languages without manually editing version numbers. The Windows EXE and Mac DMG buttons are for initial installation; the Mac ZIP is for the updater.

## Documentation baseline and maintenance

The user guide has been audited against app 0.7.2 and its development history. The [audit report](maintenance/documentation-audit-2026-09.md) records the baseline, covered changes, source evidence and validation.

For each release, compare changed user workflows against both language editions, including lifecycle rules, labels, screenshots and troubleshooting. Automated checks catch structural errors, not outdated behavioral claims. New public media must not contain real participant or local-user data. Existing recording scripts date from June and load a real event by default; do not run them unchanged for new public recordings.
