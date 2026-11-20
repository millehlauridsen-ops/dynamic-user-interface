import { NavLink } from "react-router";
import busIcon from "../assets/busvektor.svg";
import styles from "./BottomNavigation.module.css";

export default function BottomNavigation({ onOpenMenu, selectedTheme }) {
  const isPokemon = selectedTheme === "pokemon";

  return (
    <nav
      className={`${styles.navigation} ${isPokemon ? styles.pokemonNav : ""}`}
      aria-label="Primær navigation"
    >
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
      {isPokemon && (
        <NavLink
          to="/"
          end
          className={styles.transitOrb}
          aria-label="Vis kort"
        >
          <span className={styles.orbTop} aria-hidden="true" />
          <span className={styles.orbLine} aria-hidden="true" />
          <span className={styles.orbCenter} aria-hidden="true">
            <img src={busIcon} alt="" />
          </span>
        </NavLink>
      )}
    </nav>
  );
}
