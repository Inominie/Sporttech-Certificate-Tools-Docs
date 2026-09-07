import {useCallback, useState, type ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
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
    label: translate({id: 'homepage.workflow.event.label', message: 'Event'}),
    title: translate({id: 'homepage.workflow.event.title', message: 'Choose an online Sporttech event'}),
    text: translate({id: 'homepage.workflow.event.text', message: 'Search Sporttech Explore, filter the event list, and import the live competition data into the app.'}),
    to: '/docs/event/online-event',
  },
  {
    start: 25,
    label: translate({id: 'homepage.workflow.check.label', message: 'Quick Check'}),
    title: translate({id: 'homepage.workflow.check.title', message: 'Review imported event readiness'}),
    text: translate({id: 'homepage.workflow.check.text', message: 'After import, Quick Check groups the Sporttech event data into classes and highlights what should be checked before printing.'}),
    to: '/docs/quick-check/overview',
  },
  {
    start: 39,
    label: translate({id: 'homepage.workflow.classes.label', message: 'Class data'}),
    title: translate({id: 'homepage.workflow.classes.title', message: 'Browse classes and result rows'}),
    text: translate({id: 'homepage.workflow.classes.text', message: 'Open a class, scroll through its rows, and inspect the imported team, score, rank, and qualification data.'}),
    to: '/docs/quick-check/groups-and-finals',
  },
  {
    start: 56,
    label: translate({id: 'homepage.workflow.details.label', message: 'Details'}),
    title: translate({id: 'homepage.workflow.details.title', message: 'Inspect team details and source data'}),
    text: translate({id: 'homepage.workflow.details.text', message: 'Use the details drawer to switch between summary and team information without leaving the Quick Check review.'}),
    to: '/docs/quick-check/corrections',
  },
  {
    start: 77,
    label: translate({id: 'homepage.workflow.produce.label', message: 'Produce'}),
    title: translate({id: 'homepage.workflow.produce.title', message: 'Select a certificate for preview'}),
    text: translate({id: 'homepage.workflow.produce.text', message: 'Move to Produce, select a class entry, and let the app render the matching certificate PDF preview.'}),
    to: '/docs/produce/certificates',
  },
  {
    start: 94,
    label: translate({id: 'homepage.workflow.lists.label', message: 'Lists'}),
    title: translate({id: 'homepage.workflow.lists.title', message: 'Switch between list outputs'}),
    text: translate({id: 'homepage.workflow.lists.text', message: 'Use the same imported data to preview starter lists and result lists for the selected class.'}),
    to: '/docs/produce/class-lists',
  },
];

const templateEditorTourCues: TourCue[] = [
  {
    start: 0,
    label: translate({id: 'homepage.studio.open.label', message: 'Studio'}),
    title: translate({id: 'homepage.studio.open.title', message: 'Open Certificate Studio from the app'}),
    text: translate({id: 'homepage.studio.open.text', message: 'Start from the loaded competition workspace and move into Certificate Studio without leaving the operator flow.'}),
    to: '/docs/certificate-studio/overview',
  },
  {
    start: 7,
    label: translate({id: 'homepage.studio.single.label', message: 'Single'}),
    title: translate({id: 'homepage.studio.single.title', message: 'Use Single for individual athletes'}),
    text: translate({id: 'homepage.studio.single.text', message: 'Single templates focus on one athlete with their name, club, class, score, and placement fields.'}),
    to: '/docs/certificate-studio/template-library',
  },
  {
    start: 13,
    label: translate({id: 'homepage.studio.team.label', message: 'Team'}),
    title: translate({id: 'homepage.studio.team.title', message: 'Use Team for team certificates'}),
    text: translate({id: 'homepage.studio.team.text', message: 'Team templates add team-specific data such as team name, club, member names, member count, totals, and place.'}),
    to: '/docs/certificate-studio/template-library',
  },
  {
    start: 20,
    label: translate({id: 'homepage.studio.syncro.label', message: 'Syncro'}),
    title: translate({id: 'homepage.studio.syncro.title', message: 'Use Syncro for synchronized entries'}),
    text: translate({id: 'homepage.studio.syncro.text', message: 'Synchronized templates are built for two athletes, shared club data, class details, phase, total, and placement.'}),
    to: '/docs/certificate-studio/template-library',
  },
  {
    start: 31,
    label: translate({id: 'homepage.studio.fixedText.label', message: 'Fixed Text'}),
    title: translate({id: 'homepage.studio.fixedText.title', message: 'Add reusable fixed text'}),
    text: translate({id: 'homepage.studio.fixedText.text', message: 'Create a fixed text item and use the inspector geometry controls to place it cleanly at the top of the certificate.'}),
    to: '/docs/certificate-studio/layout-controls',
  },
  {
    start: 43,
    label: translate({id: 'homepage.studio.variables.label', message: 'Variables'}),
    title: translate({id: 'homepage.studio.variables.title', message: 'Add a placeholder from event data'}),
    text: translate({id: 'homepage.studio.variables.text', message: 'Choose a placeholder in the top bar, add it to the layout, then use the Inspector dropdown with sample values to remap it.'}),
    to: '/docs/certificate-studio/placeholders',
  },
  {
    start: 68,
    label: translate({id: 'homepage.studio.realData.label', message: 'Real Data'}),
    title: translate({id: 'homepage.studio.realData.title', message: 'Turn on real-data preview'}),
    text: translate({id: 'homepage.studio.realData.text', message: 'Switch from placeholder labels to live competition values so the layout can be checked against imported event data.'}),
    to: '/docs/certificate-studio/placeholders',
  },
  {
    start: 73,
    label: translate({id: 'homepage.studio.use.label', message: 'Use'}),
    title: translate({id: 'homepage.studio.use.title', message: 'Save and use the profile'}),
    text: translate({id: 'homepage.studio.use.text', message: 'Save the edited profile, then send it back into the competition app for certificate production.'}),
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
        <p className="hero__subtitle">{translate({id: 'homepage.tagline', message: 'User documentation for importing results, checking Sporttech event data, and producing PDFs.'})}</p>
        <div className={styles.buttons}>
          <Link className="button button--secondary button--lg" to="/docs/intro">
            {translate({id: 'homepage.openDocs', message: 'Open the documentation'})}
          </Link>
          <Link className="button button--outline button--secondary button--lg" to="/docs/getting-started/basic-workflow">
            {translate({id: 'homepage.viewWorkflow', message: 'View the workflow'})}
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
      title: translate({id: 'homepage.cards.import.title', message: 'Load results'}),
      text: translate({id: 'homepage.cards.import.text', message: 'Import online Sporttech events, local OVS data, or Sporttech Excel exports.'}),
      to: '/docs/event/import-overview',
      icon: 'event' as const,
    },
    {
      title: translate({id: 'homepage.cards.check.title', message: 'Check event data'}),
      text: translate({id: 'homepage.cards.check.text', message: 'Review imported classes, warnings, finals, manual corrections, and removed entries.'}),
      to: '/docs/quick-check/overview',
      icon: 'check' as const,
    },
    {
      title: translate({id: 'homepage.cards.produce.title', message: 'Produce PDFs'}),
      text: translate({id: 'homepage.cards.produce.text', message: 'Preview, save, print, and open certificate PDFs or class lists.'}),
      to: '/docs/produce/overview',
      icon: 'produce' as const,
    },
  ];

  return (
    <section className={styles.workflowSection}>
      <div className="container">
        <div className={styles.sectionHeading}>
          <Heading as="h2">{translate({id: 'homepage.workflowHeading', message: 'Follow the app workflow'})}</Heading>
          <p>
            {translate({id: 'homepage.workflowDescription', message: 'The docs are organized around the main app sections: Event, Quick Check, Produce, Settings, and Certificate Studio.'})}
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
            <div className={styles.tourMeta} aria-label={translate({id: 'homepage.tourStep', message: 'Video step {step} of {total}: {label}'}, {step: activeCueIndex + 1, total: cues.length, label: activeCue.label})}>
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
              {translate({id: 'homepage.relatedGuide', message: 'Open related guide'})}
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
        ariaLabel={translate({id: 'homepage.workflowTour.ariaLabel', message: 'Guided tour of importing a live Sporttech event, checking event data, and producing PDFs'})}
        cues={workflowTourCues}
        eyebrow={translate({id: 'homepage.workflowTour.eyebrow', message: 'Guided workflow'})}
        posterPath="/img/app/sporttech-app-tour-poster.jpg"
        videoPath="/video/sporttech-app-tour.mp4"
      />
      <GuidedVideoTour
        ariaLabel={translate({id: 'homepage.studioTour.ariaLabel', message: 'Guided tour of opening Certificate Studio, choosing starter templates, editing placeholders, and saving a profile'})}
        cues={templateEditorTourCues}
        eyebrow={translate({id: 'homepage.studioTour.eyebrow', message: 'Template Editor'})}
        posterPath="/img/app/sporttech-template-editor-tour-poster.jpg"
        videoPath="/video/sporttech-template-editor-tour.mp4"
      />
    </>
  );
}

export default function Home(): ReactNode {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout title={siteConfig.title} description={translate({id: 'homepage.description', message: 'User documentation for Sporttech Certificate Tools.'})}>
      <HomepageHeader />
      <main>
        <WorkflowCards />
        <ScreenshotPreview />
      </main>
    </Layout>
  );
}
