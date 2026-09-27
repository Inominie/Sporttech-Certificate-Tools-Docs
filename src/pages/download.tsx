import type {ReactNode} from 'react';
import Link from '@docusaurus/Link';
import {translate} from '@docusaurus/Translate';
import {usePluginData} from '@docusaurus/useGlobalData';
import Layout from '@theme/Layout';
import Heading from '@theme/Heading';
import styles from './download.module.css';

type Installer = {url: string; size: number};
type Downloads = {version: string; releaseUrl: string; windows: Installer; mac: Installer};

function DownloadIcon(): ReactNode {
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
    <path d="M12 3v12m-5-5 5 5 5-5M4 16v4h16v-4" />
  </svg>;
}

export default function DownloadPage(): ReactNode {
  const data = usePluginData('sporttech-downloads') as Downloads;
  return (
    <Layout title={translate({id: 'downloads.title', message: 'Download the app'})}
      description={translate({id: 'downloads.description', message: 'Install Sporttech Certificate Tools for Windows or Mac.'})}>
      <main className={styles.page}>
        <header className={styles.intro}>
          <p className={styles.version}>{translate({id: 'downloads.version', message: 'Current beta · Version {version}'}, {version: data.version})}</p>
          <Heading as="h1">{translate({id: 'downloads.title', message: 'Download the app'})}</Heading>
          <p>{translate({id: 'downloads.choose', message: 'Choose your computer. You only need one installer to get started.'})}</p>
        </header>
        <div className={styles.installers}>
          <section className={styles.card} aria-labelledby="windows-heading">
            <Heading as="h2" id="windows-heading">Windows</Heading>
            <p className={styles.platform}>{translate({id: 'downloads.windows.platform', message: 'Windows PC · x64'})}</p>
            <a className={`button button--primary button--lg ${styles.download}`} href={data.windows.url}>
              <DownloadIcon />{translate({id: 'downloads.windows.button', message: 'Download for Windows'})}
            </a>
            <small>EXE · {Math.round(data.windows.size / 1_000_000)} MB</small>
            <ol>
              <li>{translate({id: 'downloads.windows.step1', message: 'Open the downloaded EXE file.'})}</li>
              <li>{translate({id: 'downloads.windows.step2', message: 'Follow the installation steps.'})}</li>
              <li>{translate({id: 'downloads.windows.step3', message: 'Start Sporttech Certificate Tools from the Start Menu.'})}</li>
            </ol>
            <p className={styles.note}>{translate({id: 'downloads.windows.note', message: 'Windows may show a security warning because this beta installer is not code-signed. Your club’s computer must allow its installation.'})}</p>
          </section>
          <section className={styles.card} aria-labelledby="mac-heading">
            <Heading as="h2" id="mac-heading">Mac</Heading>
            <p className={styles.platform}>{translate({id: 'downloads.mac.platform', message: 'macOS · Apple Silicon and Intel'})}</p>
            <a className={`button button--primary button--lg ${styles.download}`} href={data.mac.url}>
              <DownloadIcon />{translate({id: 'downloads.mac.button', message: 'Download for Mac'})}
            </a>
            <small>DMG · {Math.round(data.mac.size / 1_000_000)} MB</small>
            <ol>
              <li>{translate({id: 'downloads.mac.step1', message: 'Open the downloaded DMG file.'})}</li>
              <li>{translate({id: 'downloads.mac.step2', message: 'Drag the app into Applications.'})}</li>
              <li>{translate({id: 'downloads.mac.step3', message: 'Start the app from Applications, then eject the disk image.'})}</li>
            </ol>
            <p className={styles.note}>{translate({id: 'downloads.mac.note', message: 'One download for both Mac types. Signed with Apple Developer ID and notarized by Apple.'})}</p>
          </section>
        </div>
        <section className={styles.updates} aria-labelledby="updates-heading">
          <div>
            <Heading as="h2" id="updates-heading">{translate({id: 'downloads.installed', message: 'Already using the app?'})}</Heading>
            <p>{translate({id: 'downloads.update', message: 'Open Settings → Updates to download and install the next version. Older versions without the built-in updater need one manual installation using the links above.'})}</p>
          </div>
          <Link to="/docs/settings/checking-for-updates">{translate({id: 'downloads.updateHelp', message: 'How updates work'})} →</Link>
        </section>
        <nav className={styles.links} aria-label={translate({id: 'downloads.help', message: 'Installation help'})}>
          <Link to="/docs/getting-started/installing-beta">{translate({id: 'downloads.installation', message: 'Installation guide'})}</Link>
          <Link to="/docs/getting-started/basic-workflow">{translate({id: 'downloads.firstSteps', message: 'First steps in the app'})}</Link>
          <a href={data.releaseUrl}>{translate({id: 'downloads.notes', message: 'Release notes & technical files'})}</a>
        </nav>
      </main>
    </Layout>
  );
}
