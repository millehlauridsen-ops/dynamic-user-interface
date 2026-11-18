import { useEffect, useRef, useState } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";
import styles from "./GoogleMap.module.css";
import { getStops } from "../services/stops.js";

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
    let locationMarker = null;

    async function loadMap() {
      const stops = await getStops();
      console.log("Stoppesteder fra Supabase:", stops);
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
              featureType: "poi", // points of interest
              stylers: [{ visibility: "off" }],
            },
            {
              featureType: "transit",
              elementType: "labels.icon",
              stylers: [{ visibility: "off" }],
            },
          ],
        });

        // Vores egen lokationsmarkør
        class LocationMarker extends OverlayView {
          constructor(position) {
            super();
            this.position = position;
            this.element = document.createElement("div");
            this.element.className = styles.locationDot;
          }

          onAdd() {
            this.getPanes().overlayLayer.appendChild(this.element);
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

        if (!navigator.geolocation) return;

        // Følg brugerens position
        watchId = navigator.geolocation.watchPosition(
          (position) => {
            if (cancelled) return;

            const location = new google.maps.LatLng(
              position.coords.latitude,
              position.coords.longitude,
            );

            if (!locationMarker) {
              locationMarker = new LocationMarker(location);
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

      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }

      if (locationMarker) {
        locationMarker.setMap(null);
      }
    };
  }, []);

  return (
    <div className={styles.mapContainer}>
      <div ref={mapRef} className={styles.map} />
      {error && <p className={styles.error}>{error}</p>}
    </div>
  );
}
