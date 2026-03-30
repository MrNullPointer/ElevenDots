import styles from './PosterFallback.module.css';

export default function PosterFallback() {
  return (
    <div className={styles.poster} aria-hidden="true">
      <div className={styles.gradient} />
      <div className={styles.vignette} />
    </div>
  );
}
