import { ABOUT } from '@/lib/config/site';
import styles from './AboutContent.module.css';

export default function AboutContent() {
  return (
    <div className={styles.content}>
      <h1 className={styles.heading}>{ABOUT.heading}</h1>
      <p className={styles.subheading}>{ABOUT.subheading}</p>
      <div className={styles.bio}>
        {ABOUT.bio.map((paragraph, i) => (
          <p key={i}>{paragraph}</p>
        ))}
      </div>
      <nav className={styles.links} aria-label="Social links">
        {ABOUT.links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.href.startsWith('mailto:') ? undefined : '_blank'}
            rel={link.href.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
            className={styles.link}
          >
            {link.label}
          </a>
        ))}
      </nav>
    </div>
  );
}
