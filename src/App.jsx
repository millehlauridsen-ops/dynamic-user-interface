import { Route, Routes } from "react-router";
import HomePage from "./pages/HomePage.jsx";
import SearchPage from "./pages/SearchPage.jsx";
import FavoritesPage from "./pages/FavoritesPage.jsx";
import BottomNavigation from "./components/BottomNavigation.jsx";
import styles from "./App.module.css";

export default function App() {
  return (
    <div className={styles.app}>
      <div className={styles.content}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<SearchPage />} />
          <Route path="/favorites" element={<FavoritesPage />} />
        </Routes>
      </div>

      <BottomNavigation />
    </div>
  );
}
