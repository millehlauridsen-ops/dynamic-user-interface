import { useEffect, useState } from "react";
import { getFavorites, removeFavorite } from "../services/favorites.js";
import { getUpcomingDepartures } from "../services/departures.js";
import styles from "./FavoritesPage.module.css";
import { useNavigate } from "react-router";
import favoriteIcon from "../assets/star.svg";
import busIcon from "../assets/busvektor.svg";

function getMinutesUntil(departureAt, now) {
  return Math.max(
    0,
    Math.ceil((new Date(departureAt).getTime() - now) / 60000),
  );
}

export default function FavoritesPage() {
  const [favorites, setFavorites] = useState(getFavorites);
  const [departures, setDepartures] = useState({});
  const [loading, setLoading] = useState(true);
  const [now, setNow] = useState(Date.now());
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    function syncFavorites() {
      setFavorites(getFavorites());
    }

    window.addEventListener("favorites-changed", syncFavorites);
    window.addEventListener("storage", syncFavorites);

    return () => {
      window.removeEventListener("favorites-changed", syncFavorites);
      window.removeEventListener("storage", syncFavorites);
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function loadDepartures() {
      if (favorites.length === 0) {
        setDepartures({});
        setLoading(false);
        return;
      }

      try {
        const results = await Promise.allSettled(
          favorites.map((stop) => getUpcomingDepartures(stop.stop_id)),
        );

        if (cancelled) return;

        const updated = {};

        favorites.forEach((stop, index) => {
          const result = results[index];

          if (result.status === "rejected") {
            console.error(
              "Kunne ikke hente afgange:",
              stop.stop_id,
              result.reason,
            );
            updated[stop.stop_id] = { error: true };
            return;
          }

          const upcoming = result.value
            .filter(
              (departure) =>
                new Date(departure.departure_at).getTime() > Date.now(),
            )
            .sort(
              (a, b) => new Date(a.departure_at) - new Date(b.departure_at),
            );

          updated[stop.stop_id] = {
            next: upcoming[0] ?? null,
          };
        });

        setDepartures(updated);
      } finally {
        if (!cancelled) {
          setLoading(false);
          setNow(Date.now());
        }
      }
    }

    setLoading(true);
    loadDepartures();

    const interval = setInterval(loadDepartures, 30000);

    return () => {
      cancelled = true;
      clearInterval(interval);
    };
  }, [favorites]);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  function handleRemoveFavorite(stopId) {
    removeFavorite(stopId);
    setFavorites(getFavorites());
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <div>
          <span className={styles.kicker}>Dine genveje</span>
          <h1>Favoritter</h1>
        </div>

        {favorites.length > 0 && (
          <button
            type="button"
            className={styles.editButton}
            onClick={() => setEditing(!editing)}
          >
            {editing ? "Færdig" : "Rediger"}
          </button>
        )}
      </header>

      {favorites.length > 0 ? (
        <>
          <div className={styles.summary}>
            <img src={favoriteIcon} alt="" />
            <span>Planlagte afgange fra dine gemte stoppesteder</span>
          </div>

          <div className={styles.list}>
            {favorites.map((stop) => {
              const result = departures[stop.stop_id];
              const next = result?.next;
              const hasUpcoming =
                next && new Date(next.departure_at).getTime() > now;

              return (
                <article className={styles.card} key={stop.stop_id}>
                  <div className={styles.cardMain}>
                    <span className={styles.stationBusIcon} aria-hidden="true">
                      <img src={busIcon} alt="" />
                    </span>

                    <div className={styles.stopCopy}>
                      <strong>{stop.stop_name}</strong>
                      <small>
                        {loading && !result
                          ? "Henter næste afgang..."
                          : result?.error
                            ? "Kunne ikke hente afgange"
                            : hasUpcoming
                              ? `mod ${next.destination}`
                              : "Ingen afgange inden for 60 min."}
                      </small>
                    </div>

                    {hasUpcoming && (
                      <>
                        <span
                          className={`${styles.route} ${
                            String(next.route_short_name).includes("A")
                              ? styles.routeYellow
                              : styles.routeBlue
                          }`}
                        >
                          {next.route_short_name}
                        </span>

                        <span className={styles.time}>
                          {getMinutesUntil(next.departure_at, now)}
                          {" min"}
                        </span>
                      </>
                    )}
                  </div>

                  {editing && (
                    <button
                      type="button"
                      className={styles.removeButton}
                      onClick={() => handleRemoveFavorite(stop.stop_id)}
                    >
                      Fjern
                    </button>
                  )}
                </article>
              );
            })}
          </div>

          <button
            type="button"
            className={styles.browseButton}
            onClick={() => navigate("/search")}
          >
            <span aria-hidden="true">⌕</span>
            Find flere stoppesteder
          </button>
        </>
      ) : (
        <div className={styles.empty}>
          <span className={styles.emptyStar}>
            <img src={favoriteIcon} alt="" />
          </span>
          <strong>Ingen favoritter endnu</strong>
          <p>
            Gem de stoppesteder, du bruger mest, og få hurtig adgang til
            kommende afgange.
          </p>
          <button type="button" onClick={() => navigate("/search")}>
            Find et stoppested
          </button>
        </div>
      )}
    </main>
  );
}
