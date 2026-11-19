import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import { getStops } from "../services/stops.js";
import styles from "./GoogleMap.module.css";

const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

if (apiKey) {
  setOptions({ key: apiKey, v: "weekly" });
}

export default function GoogleMap() {
  const mapRef = useRef(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!apiKey) {
      setError("Google Maps API-nøglen mangler.");
      return;
    }

    let cancelled = false;
    let watchId = null;
    let idleListener = null;
    let updateTimer = null;
    let requestId = 0;
    let locationMarker = null;
    let stopMarkers = [];

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

        // Fælles klasse til markører på kortet
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

        // Hent stoppesteder fra det synlige område
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

            // Ignorér gamle forespørgsler
            if (cancelled || currentRequest !== requestId) {
              return;
            }

            // Fjern tidligere markører
            stopMarkers.forEach((marker) => {
              marker.setMap(null);
            });

            // Vis de nye stoppesteder
            stopMarkers = stops
              .filter(
                (stop) =>
                  Number.isFinite(stop.stop_lat) &&
                  Number.isFinite(stop.stop_lon),
              )
              .map((stop) => {
                const position = new google.maps.LatLng(
                  stop.stop_lat,
                  stop.stop_lon,
                );

                const marker = new MapMarker(
                  position,
                  styles.stopMarker,
                  stop.stop_name,
                );

                marker.setMap(map);
                return marker;
              });
          } catch (err) {
            if (!cancelled && currentRequest === requestId) {
              console.error("Kunne ikke hente stoppesteder:", err);
            }
          }
        }

        // Vent, indtil kortet er faldet til ro
        idleListener = map.addListener("idle", () => {
          clearTimeout(updateTimer);

          // Ugyldiggør tidligere forespørgsler
          requestId++;

          updateTimer = setTimeout(() => {
            updateStops();
          }, 400);
        });

        // Følg brugerens GPS-position
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
                map.setCenter(location);
              } else {
                locationMarker.setPosition(location);
              }
            },
            (err) => {
              console.warn("Lokation ikke tilgængelig:", err.message);
            },
            {
              enableHighAccuracy: true,
              timeout: 10000,
              maximumAge: 30000,
            },
          );
        }
      } catch (err) {
        if (!cancelled) {
          console.error("Google Maps fejl:", err);
          setError("Kortet kunne ikke indlæses.");
        }
      }
    }

    loadMap();

    return () => {
      cancelled = true;
      requestId++;

      clearTimeout(updateTimer);
      idleListener?.remove();

      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }

      locationMarker?.setMap(null);

      stopMarkers.forEach((marker) => {
        marker.setMap(null);
      });
    };
  }, []);

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} className={styles.map} />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
