import { NavLink } from "react-router";
import { useEffect, useState } from "react";
import styles from "./BottomNavigation.module.css";

export default function BottomNavigation({ onOpenMenu }) {
  const [theme, setTheme] = useState(() => document.documentElement.dataset.theme);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      setTheme(document.documentElement.dataset.theme);
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);

  const isPokemon = theme === "pokemon";

  return (
    <nav className={`${styles.navigation} ${isPokemon ? styles.pokemonNav : ""}`} aria-label="Primær navigation">
      <NavLink
        to="/"
        end
        className={({ isActive }) => `${isActive ? styles.active : ""} ${isPokemon ? styles.pokemonHome : ""}`}
        aria-label="Kort"
      >
        {isPokemon ? <span className={styles.pokemonOrbCenter} aria-hidden="true" /> : "Kort"}
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
