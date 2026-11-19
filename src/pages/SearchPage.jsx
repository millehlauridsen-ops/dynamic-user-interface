import { useState } from "react";
import styles from "./SearchPage.module.css";

export default function SearchPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  return (
    <main className={styles.searchPage}>
      <header className={styles.header}>
        <p>FIND DIN REJSE</p>
        <h1>Søg</h1>
      </header>

      <div className={styles.searchField}>
        <input
          type="search"
          placeholder="Søg efter stop eller linje"
          aria-label="Søg efter stoppested eller buslinje"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      <div className={styles.filters}>
        <button
          type="button"
          className={filter === "all" ? styles.active : ""}
          onClick={() => setFilter("all")}
        >
          Alle
        </button>

        <button
          type="button"
          className={filter === "stops" ? styles.active : ""}
          onClick={() => setFilter("stops")}
        >
          Stoppesteder
        </button>

        <button
          type="button"
          className={filter === "routes" ? styles.active : ""}
          onClick={() => setFilter("routes")}
        >
          Linjer
        </button>
      </div>

      <section className={styles.results}>
        <h2>I nærheden</h2>
      </section>
    </main>
  );
}
