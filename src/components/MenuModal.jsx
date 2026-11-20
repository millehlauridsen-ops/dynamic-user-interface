import { useEffect, useRef } from "react";
import styles from "./MenuModal.module.css";

export default function MenuModal({ onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;

    function handleEscape(event) {
      if (event.key === "Escape") {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);
    closeButtonRef.current?.focus({ preventScroll: true });

    return () => {
      document.removeEventListener("keydown", handleEscape);
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [onClose]);

  return (
    <div className={styles.menuLayer}>
      <button
        type="button"
        className={styles.backdrop}
        onClick={onClose}
        aria-label="Luk menu"
        tabIndex={-1}
      />

      <section
        className={styles.menuSheet}
        role="dialog"
        aria-modal="true"
        aria-labelledby="menu-title"
      >
        <div className={styles.menuHeader}>
          <div>
            <span className={styles.kicker}>MIDTTRAFIK</span>
            <h1 id="menu-title">Menu</h1>
          </div>

          <button
            ref={closeButtonRef}
            type="button"
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Luk menu"
          >
            ×
          </button>
        </div>
      </section>
    </div>
  );
}
