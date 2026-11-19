import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { getStops } from "../services/stops.js";
import { getFavorites } from "../services/favorites.js";
import StationModal from "./StationModal.jsx";
import loadingBusIcon from "../assets/loadingmbus.svg";
import styles from "./GoogleMap.module.css";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (apiKey) {
  setOptions({ key: apiKey, v: "weekly" });
}

// Dynamisk gruppering
function groupStops(stops, projection, zoom) {
  if (zoom >= 15) {
    return stops.map((stop) => [stop]);
  }

  const cellSize = 150;
  const scale = 2 ** zoom;
  const groups = new Map();

  stops.forEach((stop) => {
    const position = new google.maps.LatLng(stop.stop_lat, stop.stop_lon);
    const point = projection.fromLatLngToPoint(position);
    if (!point) return;

    const x = Math.floor((point.x * scale) / cellSize);
    const y = Math.floor((point.y * scale) / cellSize);
    const key = `${x}:${y}`;

    if (!groups.has(key)) {
      groups.set(key, []);
    }

    groups.get(key).push(stop);
  });

  return [...groups.values()];
}

export default function GoogleMap() {
  const mapRef = useRef(null);
  const refreshStopsRef = useRef(null);
  const renderStopsRef = useRef(null);
  const fitFavoritesRef = useRef(null);
  const favoritesRef = useRef(favorites);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [selectedStop, setSelectedStop] = useState(null);
  const [favorites, setFavorites] = useState(getFavorites);

  useEffect(() => {
    function updateFavorites() {
      setFavorites(getFavorites());
    }

    window.addEventListener("favorites-changed", updateFavorites);
    window.addEventListener("storage", updateFavorites);

    return () => {
      window.removeEventListener("favorites-changed", updateFavorites);
      window.removeEventListener("storage", updateFavorites);
    };
  }, []);

  useEffect(() => {
    favoritesRef.current = favorites;

    // Opdater markører på det eksisterende kort
    renderStopsRef.current?.();

    // Sørg for, at favoritstoppesteder er synlige
    if (favorites.length > 0) {
      fitFavoritesRef.current?.();
    }
  }, [favorites]);

  useEffect(() => {
    if (!apiKey) {
      setError("Google Maps API-nøglen mangler.");
      return;
    }

    let cancelled = false;
    let watchId = null;
    let idleListener = null;
    let zoomListener = null;
    let updateTimer = null;
    let requestId = 0;
    let locationMarker = null;
    let stopMarkers = [];
    let cachedStops = [];

    async function loadMap() {
      try {
        const { Map, OverlayView } = await importLibrary("maps");

        if (cancelled || !mapRef.current) return;

        const map = new Map(mapRef.current, {
          center: { lat: 56.1629, lng: 10.2039 },
          zoom: 15,
          disableDefaultUI: true,
          clickableIcons: false,
          styles: [
            {
              featureType: "poi",
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        class MapMarker extends OverlayView {
          constructor(position, className, title = "") {
            super();
            this.position = position;
            this.element = document.createElement("div");
            this.element.className = className;
            this.element.title = title;
          }

          onAdd() {
            this.getPanes().overlayMouseTarget.appendChild(this.element);
          }

          draw() {
            const projection = this.getProjection();
            if (!projection) return;
            const point = projection.fromLatLngToDivPixel(this.position);
            if (!point) return;
            this.element.style.left = `${point.x}px`;
            this.element.style.top = `${point.y}px`;
          }

          onRemove() {
            this.element.remove();
          }

          setPosition(position) {
            this.position = position;
            this.draw();
          }
        }

        function renderStops() {
          if (cancelled) return;

          const projection = map.getProjection();
          const zoom = map.getZoom();

          if (!projection || zoom == null) return;

          const savedFavorites = favoritesRef.current;

          // Brug favoritternes gemte koordinater.
          // De behøver derfor ikke ligge i cachedStops.
          const visibleStops =
            savedFavorites.length > 0
              ? savedFavorites
                  .map((stop) => ({
                    ...stop,
                    stop_lat: Number(stop.stop_lat),
                    stop_lon: Number(stop.stop_lon),
                  }))
                  .filter(
                    (stop) =>
                      Number.isFinite(stop.stop_lat) &&
                      Number.isFinite(stop.stop_lon),
                  )
              : cachedStops;

          const groups = groupStops(visibleStops, projection, zoom);

          const newMarkers = groups.map((group) => {
            if (group.length === 1) {
              const stop = group[0];
              const marker = new MapMarker(
                new google.maps.LatLng(stop.stop_lat, stop.stop_lon),
                styles.stopMarker,
                stop.stop_name,
              );

              const selectStop = () => setSelectedStop(stop);
              marker.element.addEventListener("click", selectStop);
              marker.element.setAttribute("role", "button");
              marker.element.setAttribute("tabindex", "0");
              marker.element.setAttribute(
                "aria-label",
                `Vælg stoppested ${stop.stop_name}`,
              );
              marker.element.addEventListener("keydown", (event) => {
                if (event.key === "Enter" || event.key === " ") {
                  event.preventDefault();
                  selectStop();
                }
              });
              return marker;
            }

            const latitude =
              group.reduce((sum, stop) => sum + stop.stop_lat, 0) /
              group.length;
            const longitude =
              group.reduce((sum, stop) => sum + stop.stop_lon, 0) /
              group.length;
            const position = new google.maps.LatLng(latitude, longitude);
            const marker = new MapMarker(
              position,
              styles.stopGroup,
              `${group.length} stoppesteder`,
            );

            const icon = document.createElement("span");
            icon.className = styles.groupIcon;
            const count = document.createElement("span");
            count.className = styles.groupCount;
            count.textContent = String(group.length);
            const name = document.createElement("span");
            name.className = styles.groupName;
            name.textContent = group[0].stop_name
              .split("/")[0]
              .replace(/\s*\(.*$/, "")
              .trim();
            marker.element.append(icon, count, name);

            const zoomToGroup = () => {
              map.panTo(position);
              map.setZoom(Math.min((map.getZoom() ?? 15) + 2, 19));
            };
            marker.element.addEventListener("click", zoomToGroup);
            marker.element.setAttribute("role", "button");
            marker.element.setAttribute("tabindex", "0");
            marker.element.setAttribute(
              "aria-label",
              `Zoom ind på ${group.length} stoppesteder`,
            );
            marker.element.addEventListener("keydown", (event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                zoomToGroup();
              }
            });
            return marker;
          });

          newMarkers.forEach((marker) => marker.setMap(map));
          stopMarkers.forEach((marker) => marker.setMap(null));
          stopMarkers = newMarkers;
        }

        async function updateStops() {
          const bounds = map.getBounds();
          if (!bounds || cancelled) return;
          const currentRequest = ++requestId;
          const area = {
            north: bounds.getNorthEast().lat(),
            east: bounds.getNorthEast().lng(),
            south: bounds.getSouthWest().lat(),
            west: bounds.getSouthWest().lng(),
          };

          try {
            const stops = await getStops(area);
            if (cancelled || currentRequest !== requestId) return;
            cachedStops = stops.filter(
              (stop) =>
                Number.isFinite(stop.stop_lat) &&
                Number.isFinite(stop.stop_lon),
            );
            renderStops();
          } catch (fetchError) {
            if (!cancelled && currentRequest === requestId) {
              console.error("Kunne ikke hente stoppesteder:", fetchError);
            }
          }
        }

        refreshStopsRef.current = async () => {
          setIsRefreshing(true);
          try {
            // Hold indikatoren synlig i mindst 600 ms, også ved hurtig datahentning.
            await Promise.all([
              updateStops(),
              new Promise((resolve) => setTimeout(resolve, 600)),
            ]);
          } finally {
            if (!cancelled) setIsRefreshing(false);
          }
        };

        // tilpasser kortet automatisk, så alle favoritstoppesteder kan ses, selvom de ligger forskellige steder i Aarhus

        renderStopsRef.current = renderStops;

        fitFavoritesRef.current = () => {
          const favoriteStops = favoritesRef.current
            .map((stop) => ({
              lat: Number(stop.stop_lat),
              lng: Number(stop.stop_lon),
            }))
            .filter(
              (position) =>
                Number.isFinite(position.lat) && Number.isFinite(position.lng),
            );

          if (favoriteStops.length === 0) return;

          if (favoriteStops.length === 1) {
            map.setCenter(favoriteStops[0]);
            map.setZoom(15);
            return;
          }

          const bounds = new google.maps.LatLngBounds();

          favoriteStops.forEach((position) => {
            bounds.extend(position);
          });

          map.fitBounds(bounds, 48);
        };

        // Brug favoritternes placering ved første indlæsning
        if (favoritesRef.current.length > 0) {
          fitFavoritesRef.current();
        }

        zoomListener = map.addListener("zoom_changed", () => {
          renderStops();
        });
        idleListener = map.addListener("idle", () => {
          clearTimeout(updateTimer);
          requestId++;
          updateTimer = setTimeout(updateStops, 150);
        });

        if (navigator.geolocation) {
          watchId = navigator.geolocation.watchPosition(
            (position) => {
              if (cancelled) return;
              const location = new google.maps.LatLng(
                position.coords.latitude,
                position.coords.longitude,
              );
              if (!locationMarker) {
                locationMarker = new MapMarker(location, styles.locationDot);
                locationMarker.setMap(map);
                if (favoritesRef.current.length === 0) {
                  map.setCenter(location); // Centrer kortet på brugerens placering, hvis der ikke er favoritter
                }
              } else {
                locationMarker.setPosition(location);
              }
            },
            (geoError) => {
              console.warn("Lokation ikke tilgængelig:", geoError.message);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 30000,
            },
          );
        }
      } catch (mapError) {
        if (!cancelled) {
          console.error("Google Maps fejl:", mapError);
          setError("Kortet kunne ikke indlæses.");
        }
      }
    }

    loadMap();

    return () => {
      cancelled = true;
      refreshStopsRef.current = null;
      renderStopsRef.current = null;
      fitFavoritesRef.current = null;
      requestId++;
      clearTimeout(updateTimer);
      idleListener?.remove();
      zoomListener?.remove();
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
      locationMarker?.setMap(null);
      stopMarkers.forEach((marker) => marker.setMap(null));
    };
  }, []);

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} className={styles.map} />
      <button
        type="button"
        className={styles.refreshButton}
        onClick={() => refreshStopsRef.current?.()}
        disabled={isRefreshing}
        aria-label="Opdater stoppesteder"
        aria-busy={isRefreshing}
        title="Opdater stoppesteder"
      >
        <img
          src={loadingBusIcon}
          alt=""
          className={isRefreshing ? styles.rotating : ""}
        />
      </button>
      {selectedStop && (
        <StationModal
          key={selectedStop.stop_id}
          selectedStop={selectedStop}
          onClose={() => setSelectedStop(null)}
        />
      )}
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
