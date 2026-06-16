import {themes as prismThemes} from 'prism-react-renderer';
import type {Config} from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

const config: Config = {
  title: 'Sporttech Certificate Tools',
  tagline: 'User documentation for importing results, checking Sporttech event data, and producing PDFs.',
  favicon: 'img/favicon.ico',

  future: {
    v4: true,
    faster: false,
  },

  url: 'https://inominie.github.io',
  baseUrl: '/Sporttech-Certificate-Tools-Docs/',
  organizationName: 'Inominie',
  projectName: 'Sporttech-Certificate-Tools-Docs',

  onBrokenLinks: 'throw',

  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          editUrl: 'https://github.com/Inominie/Sporttech-Certificate-Tools-Docs/tree/main/',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    image: 'img/sporttech-logo.svg',
    colorMode: {
      respectPrefersColorScheme: true,
    },
    navbar: {
      title: 'Sporttech Certificate Tools',
      logo: {
        alt: 'Sporttech Certificate Tools logo',
        src: 'img/sporttech-logo.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'userGuide',
          position: 'left',
          label: 'User Guide',
        },
        {
          href: 'https://github.com/Inominie/Sporttech-Certificate-Tools-Docs',
          label: 'GitHub',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Start here',
              to: '/docs/intro',
            },
            {
              label: 'Basic workflow',
              to: '/docs/getting-started/basic-workflow',
            },
            {
              label: 'Troubleshooting',
              to: '/docs/troubleshooting/common-issues',
            },
          ],
        },
        {
          title: 'Workflow',
          items: [
            {
              label: 'Event',
              to: '/docs/event/import-overview',
            },
            {
              label: 'Quick Check',
              to: '/docs/quick-check/overview',
            },
            {
              label: 'Produce',
              to: '/docs/produce/overview',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'Reference',
              to: '/docs/reference/current-limitations',
            },
            {
              label: 'Docs repository',
              href: 'https://github.com/Inominie/Sporttech-Certificate-Tools-Docs',
            },
          ],
        },
      ],
      copyright: `Copyright © ${new Date().getFullYear()} Sporttech Certificate Tools contributors. Built with Docusaurus.`,
    },
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
