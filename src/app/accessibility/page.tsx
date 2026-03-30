import styles from '../about/about.module.css';

export default function AccessibilityPage() {
  return (
    <main className={styles.page}>
      <a href="/" className={styles.backLink}>
        elevendots
      </a>
      <div>
        <h1>Accessibility</h1>
        <p>
          elevendots.dev is designed to be accessible to all visitors. This
          site targets WCAG 2.1 AA compliance.
        </p>

        <h2>Features</h2>
        <ul>
          <li>
            <strong>Keyboard navigation:</strong> All interactive elements are
            reachable via Tab. Escape closes modals and panels.
          </li>
          <li>
            <strong>Reduced motion:</strong> Respects the{' '}
            <code>prefers-reduced-motion</code> system setting. A manual toggle
            is also available in the settings panel.
          </li>
          <li>
            <strong>Glass mode:</strong> Three visual modes (Full, Reduced,
            Opaque) accommodate different visual preferences and
            transparency sensitivities.
          </li>
          <li>
            <strong>Color contrast:</strong> All text meets WCAG AA contrast
            ratios (4.5:1 for normal text, 3:1 for large text).
          </li>
          <li>
            <strong>No-JS baseline:</strong> Core content and navigation work
            without JavaScript. The WebGL scene is a progressive enhancement.
          </li>
          <li>
            <strong>ARIA:</strong> Dialog panels use proper role, aria-modal,
            and aria-label attributes. Toggle buttons use aria-pressed.
          </li>
          <li>
            <strong>No seizure triggers:</strong> No content flashes more than
            three times per second.
          </li>
        </ul>

        <h2>Known limitations</h2>
        <ul>
          <li>
            The Three.js WebGL scene is not accessible to screen readers. It is
            marked with <code>aria-hidden</code> and does not contain
            interactive content.
          </li>
        </ul>

        <h2>Feedback</h2>
        <p>
          If you encounter accessibility issues, please reach out at{' '}
          <a href="mailto:hello@elevendots.dev">hello@elevendots.dev</a>.
        </p>
      </div>
    </main>
  );
}
