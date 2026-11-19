import { useEffect, useRef, useState } from "react";
import styles from "./TripSchedule.module.css";

export default function TripSchedule({
  selectedTrip, selectedStop, tripStops, loading, error, listRef, onBack,
}) {
  const selectedStopRef = useRef(null);
  const [currentTime, setCurrentTime] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(Date.now()), 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (loading || tripStops.length === 0) return;
    const container = listRef.current;
    const target = selectedStopRef.current;
    if (!container || !target) return;
    const containerRect = container.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    container.scrollTop +=
      targetRect.top - containerRect.top -
      (container.clientHeight - target.clientHeight) / 2;
  }, [loading, tripStops, listRef]);

  return (
    <>
      <button type="button" className={styles.backButton} onClick={onBack}>
        ← Tilbage til afgange
      </button>
      <div className={styles.tripHeading}>
        <strong>Linje {selectedTrip.route_short_name}</strong>
        <span>Mod {selectedTrip.destination}</span>
      </div>
      {loading && <p className={styles.departureMessage}>Henter køreplan...</p>}
      {error && <p className={styles.departureMessage} role="alert">{error}</p>}
      {!loading && !error && tripStops.length === 0 && (
        <p className={styles.departureMessage}>Ingen stoppesteder fundet.</p>
      )}
      {!loading && !error && tripStops.map((stop) => {
        const passed = new Date(stop.scheduled_at).getTime() < currentTime;
        const isSelectedStop = stop.stop_id === selectedStop.stop_id;
        return (
          <div
            key={`${stop.stop_id}-${stop.stop_sequence}`}
            ref={isSelectedStop ? selectedStopRef : null}
            className={`${styles.tripStop} ${passed ? styles.tripStopPassed : ""}`}
          >
            <span>{stop.stop_name}</span>
            <time dateTime={stop.scheduled_at}>
              {new Intl.DateTimeFormat("da-DK", {
                timeZone: "Europe/Copenhagen", hour: "2-digit", minute: "2-digit",
              }).format(new Date(stop.scheduled_at))}
            </time>
          </div>
        );
      })}
    </>
  );
}
