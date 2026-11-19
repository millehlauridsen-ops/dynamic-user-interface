import styles from "./DepartureList.module.css";

export default function DepartureList({ departures, loading, error, onSelectTrip }) {
  if (loading) {
    return <p className={styles.departureMessage}>Henter afgange...</p>;
  }
  if (error) {
    return <p className={styles.departureMessage} role="alert">{error}</p>;
  }
  if (departures.length === 0) {
    return <p className={styles.departureMessage}>Ingen planlagte afgange den næste time.</p>;
  }
  return departures.map((departure, index) => (
    <button
      type="button"
      key={`${departure.trip_id}-${departure.departure_at}-${index}`}
      className={styles.departureRow}
      onClick={() => onSelectTrip(departure)}
    >
      <span className={`${styles.routeBadge} ${
        /^\d{3}$/.test(departure.route_short_name)
          ? styles.routeBadgeBlue
          : styles.routeBadgeYellow
      }`}>
        {departure.route_short_name}
      </span>
      <span className={styles.departureDetails}>
        mod {departure.destination}
        <small>Planlagt afgang</small>
      </span>
      <time className={styles.departureTime} dateTime={departure.departure_at}>
        {new Intl.DateTimeFormat("da-DK", {
          timeZone: "Europe/Copenhagen",
          hour: "2-digit",
          minute: "2-digit",
        }).format(new Date(departure.departure_at))}
      </time>
    </button>
  ));
}
