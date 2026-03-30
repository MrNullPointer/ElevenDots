import styles from '../about/about.module.css';

export default function CreditsPage() {
  return (
    <main className={styles.page}>
      <a href="/" className={styles.backLink}>
        elevendots
      </a>
      <div>
        <h1>Credits</h1>
        <section>
          <h2>Technology</h2>
          <ul>
            <li>Built with Next.js, React, and TypeScript</li>
            <li>3D scene powered by Three.js via React Three Fiber</li>
            <li>State management by Zustand</li>
            <li>Visual regression testing with Playwright</li>
          </ul>
        </section>
        <section>
          <h2>Typography</h2>
          <p>System font stack with Inter as the preferred display face.</p>
        </section>
        <section>
          <h2>Design</h2>
          <p>
            Cryogenic Tide visual language. Obsidian navy, frost white,
            cryogenic blue. Glass morphism with three accessibility modes.
          </p>
        </section>
      </div>
    </main>
  );
}
