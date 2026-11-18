import { NavLink } from "react-router";
import styles from "./BottomNavigation.module.css";

export default function BottomNavigation() {
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
    </nav>
  );
}
