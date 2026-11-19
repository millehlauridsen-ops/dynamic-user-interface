import { useEffect, useRef, useState } from "react";
import { getUpcomingDepartures } from "../services/departures.js";
import { getTripSchedule } from "../services/tripSchedule.js";
import busIcon from "../assets/busvektor.svg";
import favoriteIcon from "../assets/star.svg";
import DepartureList from "./DepartureList.jsx";
import TripSchedule from "./TripSchedule.jsx";
import styles from "./StationModal.module.css";

export default function StationModal({ selectedStop, onClose }) {
  const tripListRef = useRef(null);
  const [departures, setDepartures] = useState([]);
  const [departuresLoading, setDeparturesLoading] = useState(true);
  const [departuresError, setDeparturesError] = useState("");
  const [selectedTrip, setSelectedTrip] = useState(null);
  const [tripStops, setTripStops] = useState([]);
  const [tripLoading, setTripLoading] = useState(false);
  const [tripError, setTripError] = useState("");

  useEffect(() => {
    if (!selectedStop) {
      setDepartures([]);
      setDeparturesError("");
      setDeparturesLoading(false);
      return;
    }

    let cancelled = false;
    let requestId = 0;

    setDepartures([]);
    setDeparturesError("");
    setDeparturesLoading(true);

    async function loadDepartures() {
      const currentRequest = ++requestId;

      try {
        const data = await getUpcomingDepartures(selectedStop.stop_id);

        if (!cancelled && currentRequest === requestId) {
          setDepartures(data);
          setDeparturesError("");
        }
      } catch (fetchError) {
        if (!cancelled && currentRequest === requestId) {
          console.error("Fejl ved hentning af afgange:", fetchError);
          setDeparturesError("Kunne ikke hente afgange.");
        }
      } finally {
        if (!cancelled && currentRequest === requestId) {
          setDeparturesLoading(false);
        }
      }
    }

    loadDepartures();
    const interval = setInterval(loadDepartures, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [selectedStop]);

  useEffect(() => {
    if (!selectedStop) return;

    function closeOnEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    window.addEventListener("keydown", closeOnEscape);
    return () => window.removeEventListener("keydown", closeOnEscape);
  }, [selectedStop]);

  useEffect(() => {
    if (!selectedTrip || !selectedStop) return;

    let cancelled = false;

    async function loadTrip() {
      setTripLoading(true);
      setTripError("");
      setTripStops([]);

      try {
        const stops = await getTripSchedule(
          selectedTrip.trip_id,
          selectedStop.stop_id,
          selectedTrip.departure_at,
        );

        if (!cancelled) {
          setTripStops(stops);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Fejl ved hentning af rute:", error);
          setTripError("Kunne ikke hente bussens køreplan.");
        }
      } finally {
        if (!cancelled) {
          setTripLoading(false);
        }
      }
    }

    loadTrip();

    return () => {
      cancelled = true;
    };
  }, [selectedTrip, selectedStop]);


  const routeNames = [...new Set(departures.map((d) => d.route_short_name))];

  return (
    <>
      <button type="button" className={styles.modalBackdrop} onClick={onClose}
        aria-label="Luk stoppested ved klik udenfor" />
      <section className={styles.stopInfo} role="dialog" aria-modal="true"
        aria-labelledby="station-modal-title">
        <button type="button" className={styles.modalHandle} onClick={onClose}
          aria-label="Luk stoppested">
          <span />
        </button>
        <div className={styles.modalHeader}>
          <div className={styles.stationTitleMain}>
            <span className={styles.stationBusIcon} aria-hidden="true">
              <img src={busIcon} alt="" />
            </span>
            <div className={styles.stopDetails}>
              <h2 id="station-modal-title">{selectedStop.stop_name}</h2>
              <p>{routeNames.length > 0
                ? `Linje ${routeNames.join(" · ")}`
                : "Afgange de næste 60 minutter"}</p>
            </div>
          </div>
          {/* Kun visuel stjerne indtil favoritfunktionen er klar. */}
          <span className={styles.favoriteIcon} aria-hidden="true">
            <img src={favoriteIcon} alt="" />
          </span>
        </div>
        <div ref={tripListRef} className={styles.departureList}>
          {selectedTrip ? (
            <TripSchedule
              selectedTrip={selectedTrip}
              selectedStop={selectedStop}
              tripStops={tripStops}
              loading={tripLoading}
              error={tripError}
              listRef={tripListRef}
              onBack={() => setSelectedTrip(null)}
            />
          ) : (
            <DepartureList
              departures={departures}
              loading={departuresLoading}
              error={departuresError}
              onSelectTrip={setSelectedTrip}
            />
          )}
        </div>
      </section>
    </>
  );
}
