import type {SidebarsConfig} from '@docusaurus/plugin-content-docs';

const sidebars: SidebarsConfig = {
  userGuide: [
    'intro',
    {
      type: 'category',
      label: 'Getting Started',
      items: [
        'getting-started/installing-beta',
        'getting-started/first-run',
        'getting-started/basic-workflow',
      ],
    },
    {
      type: 'category',
      label: 'Event',
      items: [
        'event/import-overview',
        'event/online-event',
        'event/offline-ovs',
        'event/file-import',
        'event/auto-refresh',
      ],
    },
    {
      type: 'category',
      label: 'Quick Check',
      items: [
        'quick-check/overview',
        'quick-check/corrections',
        'quick-check/groups-and-finals',
      ],
    },
    {
      type: 'category',
      label: 'Certificate Studio',
      items: [
        'certificate-studio/overview',
        'certificate-studio/template-library',
        'certificate-studio/placeholders',
        'certificate-studio/layout-controls',
      ],
    },
    {
      type: 'category',
      label: 'Produce',
      items: [
        'produce/overview',
        'produce/certificates',
        'produce/class-lists',
        'produce/preview-save-print',
        'produce/print-calibration',
      ],
    },
    {
      type: 'category',
      label: 'Settings',
      items: [
        'settings/overview',
        'settings/checking-for-updates',
        'settings/import-policy',
        'settings/support-bundles',
      ],
    },
    {
      type: 'category',
      label: 'Troubleshooting',
      items: ['troubleshooting/common-issues'],
    },
    {
      type: 'category',
      label: 'Reference',
      items: [
        'reference/behavior-contracts',
        'reference/current-limitations',
        'reference/glossary',
      ],
    },
  ],
};

export default sidebars;
