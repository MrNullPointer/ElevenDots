import AboutContent from '@/components/ui/AboutContent';
import styles from './about.module.css';

export default function AboutPage() {
  return (
    <main className={styles.page}>
      <a href="/" className={styles.backLink}>
        elevendots
      </a>
      <AboutContent />
    </main>
  );
}
