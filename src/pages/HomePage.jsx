import GoogleMap from "../components/GoogleMap.jsx";
import styles from "./HomePage.module.css";

export default function HomePage() {
  return (
    <main className={styles.page}>
      <div className={styles.map}>
        <GoogleMap />

        <div className={styles.heading}>
          <span>Stoppesteder i nærheden</span>
          <h1>Vælg et område</h1>
        </div>
      </div>
    </main>
  );
}
