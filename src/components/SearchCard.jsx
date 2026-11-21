import styles from "./SearchCard.module.css";
import busIcon from "../assets/busvektor.svg";
import chevronIcon from "../assets/chevron.svg";

export default function SearchCard({ type, title, subtitle, line, onClick }) {
  const isRoute = type === "route";

  return (
    <article
      className={styles.card}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onClick={onClick}
      onKeyDown={
        onClick
          ? (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                onClick();
              }
            }
          : undefined
      }
    >
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
            <img src={busIcon} alt="" />
          </span>
        )}
      </div>

      <div className={styles.content}>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>

      <img
        src={chevronIcon}
        className={styles.arrow}
        alt=""
        aria-hidden="true"
      />
    </article>
  );
}
