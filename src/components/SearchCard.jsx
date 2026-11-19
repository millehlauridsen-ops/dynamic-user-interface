import styles from "./SearchCard.module.css";

export default function SearchCard({ type, title, subtitle, line }) {
  const isRoute = type === "route";

  return (
    <article className={styles.card}>
      <div className={styles.icon}>
        {isRoute ? (
          <span
            className={`${styles.lineBadge} ${
              /^\d{3}$/.test(line) ? styles.blue : styles.yellow
            }`}
          >
            {line}
          </span>
        ) : (
          <span className={styles.stopIcon} aria-hidden="true">
            🚌
          </span>
        )}
      </div>

      <div className={styles.content}>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <span className={styles.arrow} aria-hidden="true">
        ›
      </span>
    </article>
  );
}
