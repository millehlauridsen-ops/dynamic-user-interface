import { Route, Routes } from "react-router";
import { useEffect, useState } from "react";
import HomePage from "./pages/HomePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import BottomNavigation from "./components/BottomNavigation.jsx";
import styles from "./App.module.css";

export default function App() {
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      console.warn("Geolocation understøttes ikke.");
      return;
    }

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.warn("Lokation ikke tilgængelig:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 30000,
      },
    );

    return () => {
      navigator.geolocation.clearWatch(watchId);
    };
  }, []);

  return (
    <div className={styles.app}>
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<HomePage userLocation={userLocation} />} />

          <Route
            path="/search"
            element={<SearchPage userLocation={userLocation} />}
          />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </div>

      <BottomNavigation />
    </div>
  );
}
