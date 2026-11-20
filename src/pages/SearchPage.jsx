import { useEffect, useState } from "react";
import styles from "./SearchPage.module.css";
import { searchStops } from "../services/stops.js";
import { searchRoutes } from "../services/routes.js";
import SearchCard from "../components/SearchCard.jsx";
import { getNearbyStops } from "../services/stops.js";

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
          searchStops(search),
          searchRoutes(search),
        ]);

        if (cancelled) return;

        setStops(stopResults);
        setRoutes(routeResults);
      } catch (fetchError) {
        if (cancelled) return;

        console.error("Søgefejl:", fetchError);
        setError("Kunne ikke hente søgeresultater.");
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }, 300); // vent 300ms før søgning for at undgå for mange forespørgsler

    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [search]);

  // hent nærmeste stoppesteder baseret på brugerens placering
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
        const stops = await getNearbyStops(
          userLocation.latitude,
          userLocation.longitude,
        );

        if (!cancelled) {
          setNearbyStops(stops);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Fejl ved hentning af stoppesteder:", error);
          setLocationError("Kunne ikke hente stoppesteder i nærheden.");
        }
      } finally {
        if (!cancelled) {
          setLocationLoading(false);
        }
      }
    }

    loadNearbyStops();

    return () => {
      cancelled = true;
    };
  }, [userLocation?.latitude, userLocation?.longitude]);

  return (
    <main className={styles.searchPage}>
      <header className={styles.header}>
        <p>FIND DIN REJSE</p>
        <h1>Søg</h1>
      </header>

      <div className={styles.searchField}>
        <input
          type="search"
          placeholder="Søg efter stop eller linje"
          aria-label="Søg efter stoppested eller buslinje"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className={styles.filters}>
        <button
          type="button"
          className={filter === "all" ? styles.active : ""}
          onClick={() => setFilter("all")}
        >
          Alle
        </button>

        <button
          type="button"
          className={filter === "stops" ? styles.active : ""}
          onClick={() => setFilter("stops")}
        >
          Stoppesteder
        </button>

        <button
          type="button"
          className={filter === "routes" ? styles.active : ""}
          onClick={() => setFilter("routes")}
        >
          Linjer
        </button>
      </div>

      <section className={styles.results}>
        <h2>{search.trim() ? "Søgeresultater" : "I nærheden"}</h2>

        {!search.trim() && filter !== "routes" && (
          <>
            {locationLoading && <p>Finder stoppesteder i nærheden...</p>}

            {locationError && <p role="alert">{locationError}</p>}

            {!locationLoading && !locationError && (
              <>
                {nearbyStops.map((stop) => (
                  <SearchCard
                    key={stop.stop_id}
                    type="stop"
                    title={stop.stop_name}
                  />
                ))}

                {nearbyStops.length === 0 && (
                  <p>Ingen stoppesteder fundet i nærheden.</p>
                )}
              </>
            )}
          </>
        )}

        {loading && <p>Søger...</p>}

        {error && <p role="alert">{error}</p>}

        {!loading && !error && search.trim() && (
          <>
            {(filter === "all" || filter === "stops") &&
              stops.map((stop) => (
                <SearchCard
                  key={stop.stop_id}
                  type="stop"
                  title={stop.stop_name}
                />
              ))}

            {(filter === "all" || filter === "routes") &&
              routes.map((route) => (
                <SearchCard
                  key={route.route_id}
                  type="route"
                  title={`Linje ${route.route_short_name}`}
                  subtitle={route.route_long_name}
                  line={route.route_short_name}
                />
              ))}

            {((filter === "stops" && stops.length === 0) ||
              (filter === "routes" && routes.length === 0) ||
              (filter === "all" &&
                stops.length === 0 &&
                routes.length === 0)) && <p>Ingen resultater fundet.</p>}
          </>
        )}
      </section>
    </main>
  );
}
