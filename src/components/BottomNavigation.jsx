import { NavLink } from "react-router";
import styles from "./BottomNavigation.module.css";

export default function BottomNavigation({ onOpenMenu }) {
  return (
    <nav className={styles.navigation} aria-label="Primær navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Kort
      </NavLink>

      <NavLink
        to="/search"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Søg
      </NavLink>

      <NavLink
        to="/favorites"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        Favoritter
      </NavLink>

      <button
        type="button"
        className={styles.menuButton}
        onClick={onOpenMenu}
        aria-haspopup="dialog"
      >
        Menu
      </button>
    </nav>
  );
}
