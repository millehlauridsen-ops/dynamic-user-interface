import { NavLink } from "react-router";
import busIcon from "../assets/busvektor.svg";
import Icon from "./Icon.jsx";
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
        aria-label="Kort"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        <Icon name="map" size={25} />
        <span>Kort</span>
      </NavLink>

      <NavLink
        to="/search"
        aria-label="Søg"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        <Icon name="search" size={25} />
        <span>Søg</span>
      </NavLink>

      <NavLink
        to="/favorites"
        aria-label="Favoritter"
        className={({ isActive }) => (isActive ? styles.active : "")}
      >
        <Icon name="star" size={25} />
        <span>Favoritter</span>
      </NavLink>

      <button
        type="button"
        className={styles.menuButton}
        onClick={onOpenMenu}
        aria-label="Menu"
        aria-haspopup="dialog"
      >
        <Icon name="menu" size={25} />
        <span>Menu</span>
      </button>

      {isPokemon && (
        <NavLink to="/" end className={styles.transitOrb} aria-label="Vis kort">
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
