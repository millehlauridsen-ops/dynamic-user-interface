import { useEffect, useState } from "react";
import styles from "./SearchPage.module.css";
import { searchStops, getNearbyStops } from "../services/stops.js";
import { searchRoutes } from "../services/routes.js";
import SearchCard from "../components/SearchCard.jsx";

export default function SearchPage({ userLocation }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [nearbyStops, setNearbyStops] = useState([]);
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState("");

  useEffect(() => {
    let cancelled = false;

    if (!search.trim()) {
      setStops([]);
      setRoutes([]);
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setStops([]);
    setRoutes([]);

    const timer = setTimeout(async () => {
      try {
        const [stopResults, routeResults] = await Promise.all([
          searchStops(search.trim()),
          searchRoutes(search.trim()),
        ]);

        if (cancelled) return;

        setStops(stopResults);
        setRoutes(routeResults);
      } catch (fetchError) {
        if (cancelled) return;

        console.error("Søgefejl:", fetchError);
        setError("Kunne ikke hente søgeresultater.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  useEffect(() => {
    if (!userLocation) {
      setLocationLoading(true);
      return;
    }

    let cancelled = false;

    async function loadNearbyStops() {
      setLocationLoading(true);
      setLocationError("");

      try {
        const results = await getNearbyStops(
          userLocation.latitude,
          userLocation.longitude,
        );

        if (!cancelled) setNearbyStops(results);
      } catch (fetchError) {
        if (!cancelled) {
          console.error("Fejl ved hentning af stoppesteder:", fetchError);
          setLocationError("Kunne ikke hente stoppesteder i nærheden.");
        }
      } finally {
        if (!cancelled) setLocationLoading(false);
      }
    }

    loadNearbyStops();

    return () => {
      cancelled = true;
    };
  }, [userLocation?.latitude, userLocation?.longitude]);

  const hasSearch = Boolean(search.trim());
  const showStops = filter === "all" || filter === "stops";
  const showRoutes = filter === "all" || filter === "routes";

  const visibleStops = hasSearch
    ? showStops
      ? stops
      : []
    : showStops
      ? nearbyStops
      : [];

  const visibleRoutes = hasSearch && showRoutes ? routes : [];

  const resultCount = visibleStops.length + visibleRoutes.length;

  const isLoading = hasSearch ? loading : showStops && locationLoading;
  const currentError = hasSearch ? error : showStops ? locationError : "";

  return (
    <main className={styles.searchPage}>
      <header className={styles.header}>
        <p>FIND DIN REJSE</p>
        <h1>Søg</h1>
      </header>

      <div className={styles.searchField}>
        <svg
          className={styles.searchIcon}
          width="21"
          height="21"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="8" />
          <path d="m21 21-4.35-4.35" />
        </svg>

        <input
          type="search"
          placeholder="Søg efter stop eller linje"
          aria-label="Søg efter stoppested eller buslinje"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        {search && (
          <button
            type="button"
            className={styles.clearButton}
            onClick={() => setSearch("")}
            aria-label="Ryd søgning"
          >
            ×
          </button>
        )}
      </div>

      <div className={styles.filters} aria-label="Filtrer søgeresultater">
        <button
          type="button"
          className={filter === "all" ? styles.active : ""}
          onClick={() => setFilter("all")}
          aria-pressed={filter === "all"}
        >
          Alle
        </button>

        <button
          type="button"
          className={filter === "stops" ? styles.active : ""}
          onClick={() => setFilter("stops")}
          aria-pressed={filter === "stops"}
        >
          Stoppesteder
        </button>

        <button
          type="button"
          className={filter === "routes" ? styles.active : ""}
          onClick={() => setFilter("routes")}
          aria-pressed={filter === "routes"}
        >
          Linjer
        </button>
      </div>

      <section className={styles.results}>
        <div className={styles.resultsHeader}>
          <h2>{hasSearch ? "Søgeresultater" : "I nærheden"}</h2>
          {!isLoading && !currentError && (
            <span>
              {resultCount} {resultCount === 1 ? "resultat" : "resultater"}
            </span>
          )}
        </div>

        <div className={styles.resultsList}>
          {isLoading && (
            <p className={styles.status}>
              {hasSearch ? "Søger..." : "Finder stoppesteder i nærheden..."}
            </p>
          )}

          {currentError && (
            <p className={styles.status} role="alert">
              {currentError}
            </p>
          )}

          {!isLoading && !currentError && (
            <>
              {visibleStops.map((stop) => (
                <SearchCard
                  key={`stop-${stop.stop_id}`}
                  type="stop"
                  title={stop.stop_name}
                />
              ))}

              {visibleRoutes.map((route) => (
                <SearchCard
                  key={`route-${route.route_id}`}
                  type="route"
                  title={`Linje ${route.route_short_name}`}
                  subtitle={route.route_long_name}
                  line={route.route_short_name}
                />
              ))}

              {resultCount === 0 && (
                <div className={styles.emptyState}>
                  <strong>Ingen resultater</strong>
                  <span>
                    {hasSearch
                      ? "Prøv et andet stoppested eller linjenummer."
                      : "Ingen resultater fundet i nærheden."}
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </main>
  );
}
