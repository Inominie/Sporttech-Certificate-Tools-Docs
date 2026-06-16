import {useCallback, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';

import styles from './index.module.css';

type TourCue = {
  start: number;
  label: string;
  title: string;
  text: string;
  to: string;
};

const workflowTourCues: TourCue[] = [
  {
    start: 0,
    label: 'Event',
    title: 'Choose an online Sporttech event',
    text: 'Search Sporttech Explore, filter the event list, and import the live competition data into the app.',
    to: '/docs/event/online-event',
  },
  {
    start: 25,
    label: 'Quick Check',
    title: 'Review imported event readiness',
    text: 'After import, Quick Check groups the Sporttech event data into classes and highlights what should be checked before printing.',
    to: '/docs/quick-check/overview',
  },
  {
    start: 39,
    label: 'Class data',
    title: 'Browse classes and result rows',
    text: 'Open a class, scroll through its rows, and inspect the imported team, score, rank, and qualification data.',
    to: '/docs/quick-check/groups-and-finals',
  },
  {
    start: 56,
    label: 'Details',
    title: 'Inspect team details and source data',
    text: 'Use the details drawer to switch between summary and team information without leaving the Quick Check review.',
    to: '/docs/quick-check/corrections',
  },
  {
    start: 77,
    label: 'Produce',
    title: 'Select a certificate for preview',
    text: 'Move to Produce, select a class entry, and let the app render the matching certificate PDF preview.',
    to: '/docs/produce/certificates',
  },
  {
    start: 94,
    label: 'Lists',
    title: 'Switch between list outputs',
    text: 'Use the same imported data to preview starter lists and result lists for the selected class.',
    to: '/docs/produce/class-lists',
  },
];

const templateEditorTourCues: TourCue[] = [
  {
    start: 0,
    label: 'Studio',
    title: 'Open Certificate Studio from the app',
    text: 'Start from the loaded competition workspace and move into Certificate Studio without leaving the operator flow.',
    to: '/docs/certificate-studio/overview',
  },
  {
    start: 7,
    label: 'Single',
    title: 'Use Single for individual athletes',
    text: 'Single templates focus on one athlete with their name, club, class, score, and placement fields.',
    to: '/docs/certificate-studio/template-library',
  },
  {
    start: 13,
    label: 'Team',
    title: 'Use Team for team certificates',
    text: 'Team templates add team-specific data such as team name, club, member names, member count, totals, and place.',
    to: '/docs/certificate-studio/template-library',
  },
  {
    start: 20,
    label: 'Syncro',
    title: 'Use Syncro for synchronized entries',
    text: 'Synchronized templates are built for two athletes, shared club data, class details, phase, total, and placement.',
    to: '/docs/certificate-studio/template-library',
  },
  {
    start: 31,
    label: 'Fixed Text',
    title: 'Add reusable fixed text',
    text: 'Create a fixed text item and use the inspector geometry controls to place it cleanly at the top of the certificate.',
    to: '/docs/certificate-studio/layout-controls',
  },
  {
    start: 43,
    label: 'Variables',
    title: 'Add a placeholder from event data',
    text: 'Choose a placeholder in the top bar, add it to the layout, then use the Inspector dropdown with sample values to remap it.',
    to: '/docs/certificate-studio/placeholders',
  },
  {
    start: 68,
    label: 'Real Data',
    title: 'Turn on real-data preview',
    text: 'Switch from placeholder labels to live competition values so the layout can be checked against imported event data.',
    to: '/docs/certificate-studio/placeholders',
  },
  {
    start: 73,
    label: 'Use',
    title: 'Save and use the profile',
    text: 'Save the edited profile, then send it back into the competition app for certificate production.',
    to: '/docs/produce/certificates',
  },
];

function getTourCueIndex(cues: TourCue[], currentTime: number): number {
  for (let index = cues.length - 1; index >= 0; index -= 1) {
    if (currentTime >= cues[index].start) {
      return index;
    }
  }

  return 0;
}

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          {siteConfig.title}
        </Heading>
        <p className="hero__subtitle">{siteConfig.tagline}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            Open the documentation
          </Link>
          <Link className="button button--outline button--secondary button--lg" to="/docs/getting-started/basic-workflow">
            View the workflow
          </Link>
        </div>
      </div>
    </header>
  );
}

function CardIcon({type}: {type: 'event' | 'check' | 'produce'}): ReactNode {
  if (type === 'event') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M12 3v12" />
        <path d="m7 8 5-5 5 5" />
        <path d="M4 14v4a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-4" />
      </svg>
    );
  }

  if (type === 'check') {
    return (
      <svg aria-hidden="true" viewBox="0 0 24 24">
        <path d="M21 12a9 9 0 1 1-6.2-8.6" />
        <path d="m9 12 2 2 7-8" />
      </svg>
    );
  }

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8Z" />
      <path d="M14 2v6h6" />
      <path d="M8 13h8" />
      <path d="M8 17h5" />
    </svg>
  );
}

function WorkflowCards(): ReactNode {
  const cards = [
    {
      title: 'Load results',
      text: 'Import online Sporttech events, local OVS data, or Sporttech Excel exports.',
      to: '/docs/event/import-overview',
      icon: 'event' as const,
    },
    {
      title: 'Check event data',
      text: 'Review imported classes, warnings, finals, manual corrections, and removed entries.',
      to: '/docs/quick-check/overview',
      icon: 'check' as const,
    },
    {
      title: 'Produce PDFs',
      text: 'Preview, save, print, and open certificate PDFs or class lists.',
      to: '/docs/produce/overview',
      icon: 'produce' as const,
    },
  ];

  return (
    <section className={styles.workflowSection}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <Heading as="h2">Follow the app workflow</Heading>
          <p>
            The docs are organized around the main app sections: Event, Quick Check,
            Produce, Settings, and Certificate Studio.
          </p>
        </div>
        <div className={styles.cardGrid}>
          {cards.map((card) => (
            <Link className={styles.workflowCard} key={card.title} to={card.to}>
              <span className={styles.cardIcon}>
                <CardIcon type={card.icon} />
              </span>
              <h3>{card.title}</h3>
              <p>{card.text}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

type GuidedVideoTourProps = {
  ariaLabel: string;
  cues: TourCue[];
  eyebrow: string;
  posterPath: string;
  videoPath: string;
};

function GuidedVideoTour({
  ariaLabel,
  cues,
  eyebrow,
  posterPath,
  videoPath,
}: GuidedVideoTourProps): ReactNode {
  const tourVideo = useBaseUrl(videoPath);
  const tourPoster = useBaseUrl(posterPath);
  const [activeCueIndex, setActiveCueIndex] = useState(0);
  const activeCue = cues[activeCueIndex] ?? cues[0];

  const updateActiveCue = useCallback((video: HTMLVideoElement) => {
    const nextCueIndex = getTourCueIndex(cues, video.currentTime);
    setActiveCueIndex((currentCueIndex) => (
      currentCueIndex === nextCueIndex ? currentCueIndex : nextCueIndex
    ));
  }, [cues]);

  return (
    <section className={styles.previewSection}>
      <div className="container">
        <div className={styles.previewGrid}>
          <div className={styles.tourCopyPanel}>
            <span className={styles.tourEyebrow}>{eyebrow}</span>
            <Heading as="h2" className={styles.tourTitle} aria-live="polite">
              {activeCue.title}
            </Heading>
            <p className={styles.tourDescription}>{activeCue.text}</p>
            <div className={styles.tourMeta} aria-label={`Video step ${activeCueIndex + 1} of ${cues.length}: ${activeCue.label}`}>
              <span>{activeCue.label}</span>
              <span>{activeCueIndex + 1} / {cues.length}</span>
            </div>
            <div className={styles.tourDots} aria-hidden="true">
              {cues.map((cue, index) => (
                <span
                  className={clsx(styles.tourDot, index === activeCueIndex && styles.tourDotActive)}
                  key={cue.label}
                />
              ))}
            </div>
            <Link className="button button--primary" to={activeCue.to}>
              Open related guide
            </Link>
          </div>
          <div className={styles.previewFrame}>
            <div className={styles.previewWindowBar} aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <video
              aria-label={ariaLabel}
              autoPlay
              className={styles.previewVideo}
              loop
              muted
              onLoadedMetadata={(event) => updateActiveCue(event.currentTarget)}
              onSeeked={(event) => updateActiveCue(event.currentTarget)}
              onTimeUpdate={(event) => updateActiveCue(event.currentTarget)}
              playsInline
              poster={tourPoster}
              preload="metadata"
            >
              <source src={tourVideo} type="video/mp4" />
            </video>
          </div>
        </div>
      </div>
    </section>
  );
}

function ScreenshotPreview(): ReactNode {
  return (
    <>
      <GuidedVideoTour
        ariaLabel="Guided tour of importing a live Sporttech event, checking event data, and producing PDFs"
        cues={workflowTourCues}
        eyebrow="Guided workflow"
        posterPath="/img/app/sporttech-app-tour-poster.jpg"
        videoPath="/video/sporttech-app-tour.mp4"
      />
      <GuidedVideoTour
        ariaLabel="Guided tour of opening Certificate Studio, choosing starter templates, editing placeholders, and saving a profile"
        cues={templateEditorTourCues}
        eyebrow="Template Editor"
        posterPath="/img/app/sporttech-template-editor-tour-poster.jpg"
        videoPath="/video/sporttech-template-editor-tour.mp4"
      />
    </>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description="User documentation for Sporttech Certificate Tools.">
      <HomepageHeader />
      <main>
        <WorkflowCards />
        <ScreenshotPreview />
      </main>
    </Layout>
  );
}
