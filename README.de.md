# Sporttech Certificate Tools Docs

[English](README.md) | [Deutsch](README.de.md)

Benutzerdokumentation für Sporttech Certificate Tools.

Die Website wird mit [Docusaurus](https://docusaurus.io/) erstellt und über GitHub Pages aus dem öffentlichen Repository `Inominie/Sporttech-Certificate-Tools-Docs` veröffentlicht.

## Sprachen

Englisch bleibt die Standardsprache unter den bisherigen URLs. Deutsch ist unter `/de/` verfügbar. Über das Menü **English / Deutsch** in der Navigationsleiste wechselst du die Sprache.

- [Englische Dokumentation](https://inominie.github.io/Sporttech-Certificate-Tools-Docs/)
- [Deutsche Dokumentation](https://inominie.github.io/Sporttech-Certificate-Tools-Docs/de/)

Die englischen Schaltflächenbezeichnungen der App bleiben in den deutschen Anleitungen zur Wiedererkennung erhalten. Beide Sprachversionen verwenden die vorhandenen Screenshots und Videos gemeinsam; Beschreibungen, Alternativtexte und Begleittexte der Videotouren sind übersetzt.

## Installation

Verwende wie im Veröffentlichungsworkflow Node.js 22 und installiere die festgelegten Abhängigkeiten aus dem vollständigen Repository:

```bash
npm ci
```

## Lokale Entwicklung

Für die englische Version:

```bash
npm run start
```

Für die deutsche Version:

```bash
npm run start:de
```

Der Entwicklungsserver startet jeweils für eine Sprache. Die meisten Inhaltsänderungen werden ohne Neustart sichtbar. Um den Wechsel zwischen beiden Sprachen zu testen, erstelle und starte stattdessen die gesamte Website:

```bash
npm run build
npm run serve
```

## Übersetzungen pflegen

| Inhalt | Englische Quelle | Deutsche Übersetzung |
| --- | --- | --- |
| Dokumentationsseiten | `docs/` | `i18n/de/docusaurus-plugin-content-docs/current/` |
| Startseite und Videotouren | `translate()`-Texte in `src/pages/index.tsx` | `i18n/de/code.json` |
| Kategorien der Seitenleiste | `sidebars.ts` | `i18n/de/docusaurus-plugin-content-docs/current.json` |
| Navigation und Fußzeile | `docusaurus.config.ts` | `i18n/de/docusaurus-theme-classic/` |

Aktualisiere bei neuen oder geänderten Seiten beide Sprachen. Behalte übereinstimmende relative Dateipfade, Dokument-IDs, Slugs und explizite Abschnittsanker bei. Schreibe Anker als MDX-Kommentare wie `## Überschrift {/* #stable-id */}`; die Konfiguration `future.v4` unterstützt die alte Syntax `{#stable-id}` nicht. Setze im Frontmatter einen ausdrücklichen übersetzten `title`, damit Überschriftenkommentare nicht in Seitentiteln, Seitenleisten oder der Brotkrumennavigation erscheinen. Verwende zwischen übersetzten Seiten relative Markdown-Links, damit die Navigation in der ausgewählten Sprache bleibt. Übersetze keine API-Bezeichner, Platzhalterschlüssel, Codebeispiele, Dateiendungen oder technischen Aufzählungswerte aus den Quelldaten.

Neue Startseitentexte benötigen in `translate()` eine feste, stabile `id` und einen englischen Standardtext als `message`. Aktualisiere die Übersetzungsdateien mit:

```bash
npm run write-translations -- --locale de
```

Übersetze anschließend die neu hinzugefügten Einträge und führe die unten beschriebenen Prüfungen aus. Docusaurus liefert seine allgemeinen deutschen Oberflächentexte mit; hier müssen nur projektspezifische Texte gepflegt werden. Bearbeitungslinks der deutschen Dokumentation führen zu den deutschen Quelldateien statt zu den englischen Originalen.

Die Quellenprüfung kontrolliert die strukturelle Vollständigkeit. Sie kann nicht beurteilen, ob eine Übersetzung jede spätere inhaltliche Änderung der englischen Version bereits berücksichtigt. Prüfe deshalb bei Inhaltsänderungen immer beide Fassungen. In der deutschen Fußzeile entfällt die Jahreszahl bewusst, damit das dynamische englische Copyright-Jahr nicht als feste Zahl in einer JSON-Übersetzung veraltet.

## Prüfen und erstellen

```bash
npm run validate:i18n
npm run test:i18n
npm run typecheck
npm run build
npm run validate:i18n-build
```

`validate:i18n` prüft die Vollständigkeit der Seiten, Dokumentmetadaten, stabile Abschnittsanker, technische Werte, relative Links, gemeinsame Medienpfade, Variablen der Startseitentexte und Navigationsübersetzungen. Diese Prüfung läuft auch automatisch vor `npm run build`.

`test:i18n` testet die Prüfskripte mit gültigen und absichtlich fehlerhaften Testdaten. Die dabei verwendeten HTML-Dateien sind künstliche Testdaten; sie ersetzen keinen echten Docusaurus-Build und keinen Browsertest.

`npm run build` erstellt **beide** Sprachen im Ordner `build/`: Englisch direkt darin und Deutsch unter `build/de/`. Anschließend prüft `validate:i18n-build`, ob alle HTML-Seiten beider Sprachen vorhanden sind, die Sprachattribute und Startseitenlinks stimmen und referenzierte lokale Bilder und Videos existieren. Führe diese Prüfung nach dem vollständigen Build aus, nicht nach einem Build nur einer Sprache.

## Veröffentlichung

GitHub Pages wird über `.github/workflows/deploy-pages.yml` veröffentlicht, sobald Änderungen nach `main` gepusht werden. Der Workflow installiert die Abhängigkeiten, prüft das Update-Manifest und die Typen, erstellt beide Sprachversionen, prüft die zweisprachige Ausgabe und veröffentlicht den Ordner `build` als Pages-Artefakt.

Die Produktionsadresse ist:

```text
https://inominie.github.io/Sporttech-Certificate-Tools-Docs/
```

Die deutsche Version verwendet:

```text
https://inominie.github.io/Sporttech-Certificate-Tools-Docs/de/
```
