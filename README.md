# Sporttech Certificate Tools Docs

User documentation for Sporttech Certificate Tools.

This site is built with [Docusaurus](https://docusaurus.io/) and published with GitHub Pages from the public repository `Inominie/Sporttech-Certificate-Tools-Docs`.

## Installation

```bash
npm install
```

## Local development

```bash
npm run start
```

This starts a local development server. Most content changes are reflected live without restarting the server.

## Build

```bash
npm run build
```

This generates static content into the `build` directory.

## Deployment

GitHub Pages is deployed by `.github/workflows/deploy-pages.yml` whenever `main` is pushed. The workflow installs dependencies, type-checks the site, builds Docusaurus, and publishes the `build` directory as a Pages artifact.

The production URL is configured as:

```text
https://inominie.github.io/Sporttech-Certificate-Tools-Docs/
```
