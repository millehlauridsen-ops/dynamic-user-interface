import { memo, useEffect, useRef } from "react";
import styles from "./MenuModal.module.css";

function MenuModal({ isOpen, onClose }) {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;

    const previousFocus = document.activeElement;
    function handleEscape(event) {
      if (event.key === "Escape") onClose();
    }

    document.addEventListener("keydown", handleEscape);

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      closeButtonRef.current?.focus({ preventScroll: true });
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [isOpen, onClose]);

  function handleTransitionEnd(event) {
    if (isOpen && event.target === event.currentTarget && event.propertyName === "transform") {
      closeButtonRef.current?.focus({ preventScroll: true });
    }
  }

  return (
    <div
      className={`${styles.menuLayer} ${isOpen ? styles.menuLayerOpen : ""}`}
      aria-hidden={!isOpen}
      inert={!isOpen}
    >
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
        onTransitionEnd={handleTransitionEnd}
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

export default memo(MenuModal);
