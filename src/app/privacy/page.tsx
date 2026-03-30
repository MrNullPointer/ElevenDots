import styles from '../about/about.module.css';

export default function PrivacyPage() {
  return (
    <main className={styles.page}>
      <a href="/" className={styles.backLink}>
        elevendots
      </a>
      <div>
        <h1>Privacy</h1>
        <p>
          elevendots.dev does not collect personal data, use cookies, or run
          third-party analytics. There are no tracking scripts, no ad networks,
          and no data shared with external services.
        </p>
        <p>
          The site is a static export served from a CDN. No server-side
          processing occurs. All interactions happen entirely in your browser.
        </p>
        <p>
          Audio and visual preferences (glass mode, reduced motion) are stored
          in your browser&apos;s localStorage and never leave your device.
        </p>
      </div>
    </main>
  );
}
