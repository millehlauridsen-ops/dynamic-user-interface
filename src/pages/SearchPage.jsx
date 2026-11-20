import { useEffect, useState } from "react";
import styles from "./SearchPage.module.css";
import { searchStops, getNearbyStops } from "../services/stops.js";
import {
  searchRoutes,
  getRoutesForStops,
  getRouteDescriptions,
} from "../services/routes.js";
import SearchCard from "../components/SearchCard.jsx";

// Grupperer buslinjer efter stoppested
function groupRoutesByStop(routeConnections) {
  const grouped = {};

  for (const connection of routeConnections) {
    const stopId = String(connection.stop_id);

    if (!grouped[stopId]) {
      grouped[stopId] = [];
    }

    if (!grouped[stopId].includes(connection.route_short_name)) {
      grouped[stopId].push(connection.route_short_name);
    }
  }

  for (const lines of Object.values(grouped)) {
    lines.sort((a, b) => a.localeCompare(b, "da", { numeric: true }));
  }

  return grouped;
}

// Finder de første 3 unikke buslinjer
function getUniqueRoutes(connections) {
  const routes = new Map();

  for (const connection of connections) {
    const line = connection.route_short_name;

    if (!routes.has(line)) {
      routes.set(line, connection);
    }
  }

  return [...routes.values()]
    .sort((a, b) =>
      a.route_short_name.localeCompare(b.route_short_name, "da", {
        numeric: true,
      }),
    )
    .slice(0, 3);
}

// Viser linjenumrene under et stoppested
function getStopSubtitle(stop, routesByStop) {
  const lines = routesByStop[String(stop.stop_id)] ?? [];

  if (lines.length === 0) return null;

  return `Linje ${lines.join(" · ")}`;
}

// Hovedkomponent for søgesiden
export default function SearchPage({ userLocation }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  const [stops, setStops] = useState([]);
  const [routes, setRoutes] = useState([]);
  const [searchStopRoutes, setSearchStopRoutes] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [nearbyStops, setNearbyStops] = useState([]);
  const [nearbyRoutes, setNearbyRoutes] = useState([]);
  const [nearbyStopRoutes, setNearbyStopRoutes] = useState({});
  const [locationLoading, setLocationLoading] = useState(true);
  const [locationError, setLocationError] = useState("");

  // Beskrivelser af buslinjernes retninger
  const [routeDescriptions, setRouteDescriptions] = useState({});

  // Søg efter stoppesteder og buslinjer
  useEffect(() => {
    let cancelled = false;

    if (!search.trim()) {
      setStops([]);
      setRoutes([]);
      setSearchStopRoutes({});
      setLoading(false);
      setError("");
      return;
    }

    setLoading(true);
    setError("");
    setStops([]);
    setRoutes([]);
    setSearchStopRoutes({});

    const timer = setTimeout(async () => {
      try {
        const [stopResults, routeResults] = await Promise.all([
          searchStops(search.trim()),
          searchRoutes(search.trim()),
        ]);

        if (cancelled) return;

        const connections = await getRoutesForStops(
          stopResults.map((stop) => stop.stop_id),
        );

        if (cancelled) return;

        // Hent beskrivelser for buslinjerne i søgeresultatet
        const descriptions = await getRouteDescriptions(
          routeResults.map((route) => route.route_id),
        );

        if (cancelled) return;

        setStops(stopResults);
        setRoutes(routeResults);
        setSearchStopRoutes(groupRoutesByStop(connections));

        setRouteDescriptions((previous) => ({
          ...previous,
          ...descriptions,
        }));
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

  // Find stoppesteder og buslinjer i nærheden
  useEffect(() => {
    if (!userLocation) {
      setLocationLoading(true);
      return;
    }

    let cancelled = false;

    // Hent nærliggende stoppesteder og buslinjer
    async function loadNearby() {
      setLocationLoading(true);
      setLocationError("");

      try {
        const stopResults = await getNearbyStops(
          userLocation.latitude,
          userLocation.longitude,
        );

        if (cancelled) return;

        const connections = await getRoutesForStops(
          stopResults.map((stop) => stop.stop_id),
        );

        if (cancelled) return;

        // Udvælg de 3 buslinjer, der skal vises
        const uniqueRoutes = getUniqueRoutes(connections);

        // Hent deres faktiske destinationsbeskrivelser
        const descriptions = await getRouteDescriptions(
          uniqueRoutes.map((route) => route.route_id),
        );

        if (cancelled) return;

        setNearbyStops(stopResults);
        setNearbyStopRoutes(groupRoutesByStop(connections));
        setNearbyRoutes(uniqueRoutes);

        setRouteDescriptions((previous) => ({
          ...previous,
          ...descriptions,
        }));
      } catch (fetchError) {
        if (cancelled) return;

        console.error("Fejl ved hentning af nærliggende data:", fetchError);

        setLocationError("Kunne ikke hente stoppesteder og linjer i nærheden.");
      } finally {
        if (!cancelled) setLocationLoading(false);
      }
    }

    loadNearby();

    return () => {
      cancelled = true;
    };
  }, [userLocation?.latitude, userLocation?.longitude]);

  const hasSearch = Boolean(search.trim());
  const showStops = filter === "all" || filter === "stops";
  const showRoutes = filter === "all" || filter === "routes";

  const visibleStops = showStops ? (hasSearch ? stops : nearbyStops) : [];

  const visibleRoutes = showRoutes ? (hasSearch ? routes : nearbyRoutes) : [];

  const routesByStop = hasSearch ? searchStopRoutes : nearbyStopRoutes;

  const resultCount = visibleStops.length + visibleRoutes.length;

  const isLoading = hasSearch ? loading : locationLoading;
  const currentError = hasSearch ? error : locationError;

  // Rendering af søgesiden, html
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
              {hasSearch
                ? "Søger..."
                : "Finder stoppesteder og linjer i nærheden..."}
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
                  subtitle={getStopSubtitle(stop, routesByStop)}
                />
              ))}

              {visibleRoutes.map((route) => (
                <SearchCard
                  key={`route-${route.route_id}`}
                  type="route"
                  title={`Linje ${route.route_short_name}`}
                  subtitle={
                    routeDescriptions[String(route.route_id)] ||
                    route.route_long_name
                  }
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
