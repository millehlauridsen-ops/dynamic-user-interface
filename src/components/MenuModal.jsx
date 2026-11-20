import { memo, useEffect, useRef, useState } from "react";
import styles from "./MenuModal.module.css";
import Icon from "./Icon.jsx";
import { appearanceThemes } from "../themes/appearanceThemes.js";

const menuItems = [
  {
    label: "Billetter",
    detail: "Køb og se dine billetter",
    icon: "ticket",
  },
  {
    label: "Trafikinfo",
    detail: "Driftsændringer og beskeder",
    icon: "bell",
  },
  {
    label: "Linjer og kort",
    detail: "Se alle buslinjer i Aarhus",
    icon: "map",
  },
  {
    label: "Indstillinger",
    detail: "Sprog, samtykke og tilgængelighed",
    icon: "list",
  },
];
function MenuModal({ isOpen, onClose, selectedTheme, onSelectTheme }) {
  const [showAppearance, setShowAppearance] = useState(false);
  const closeButtonRef = useRef(null);

  useEffect(() => {
    if (!isOpen) {
      setShowAppearance(false);
      return;
    }

    const previousFocus = document.activeElement;

    function handleEscape(event) {
      if (event.key !== "Escape") return;

      if (showAppearance) {
        setShowAppearance(false);
      } else {
        onClose();
      }
    }

    document.addEventListener("keydown", handleEscape);

    return () => {
      document.removeEventListener("keydown", handleEscape);
      previousFocus?.focus?.({ preventScroll: true });
    };
  }, [isOpen, onClose, showAppearance]);

  function handleTransitionEnd(event) {
    if (
      isOpen &&
      event.target === event.currentTarget &&
      event.propertyName === "transform"
    ) {
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
        <header className={styles.menuHeader}>
          <div>
            <span className={styles.kicker}>
              {showAppearance ? "PERSONLIG STIL" : "MIDTTRAFIK"}
            </span>
            <h1 id="menu-title">
              {showAppearance ? "Tilpas udseende" : "Menu"}
            </h1>
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
        </header>

        {showAppearance ? (
          <div className={styles.appearanceContent}>
            <button
              type="button"
              className={styles.backButton}
              onClick={() => setShowAppearance(false)}
            >
              <Icon name="arrow-left" size={18} />
              Tilbage til menu
            </button>

            <p className={styles.appearanceIntro}>
              Vælg den stemning, der passer dig. Funktionerne forbliver de
              samme.
            </p>

            <div
              className={styles.appearanceOptions}
              role="radiogroup"
              aria-label="Vælg app-tema"
            >
              {appearanceThemes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  role="radio"
                  aria-checked={selectedTheme === theme.id}
                  className={styles.appearanceOption}
                  onClick={() => onSelectTheme(theme.id)}
                >
                  <span className={styles.themeSwatch} data-preview-theme={theme.id} aria-hidden="true">
                    <span />
                    <span />
                    <span />
                  </span>

                  <span className={styles.appearanceCopy}>
                    <strong>{theme.label}</strong>
                    <small>{theme.detail}</small>
                  </span>

                  <span className={styles.themeIndicator} aria-hidden="true" />
                </button>
              ))}
            </div>

            {selectedTheme !== "default" && (
              <p className={styles.darkModeNote}>
                Dark mode er kun tilgængelig i Default-temaet.
              </p>
            )}
          </div>
        ) : (
          <div className={styles.menuContent}>
            <button
              type="button"
              className={styles.appearanceEntry}
              onClick={() => setShowAppearance(true)}
            >
              <span className={styles.menuIcon}>
                <Icon name="palette" />
              </span>
              <span className={styles.menuCopy}>
                <strong>Tilpas udseende</strong>
                <small>
                  {
                    appearanceThemes.find((theme) => theme.id === selectedTheme)
                      ?.label
                  }{" "}
                  er valgt
                </small>
              </span>
              <span aria-hidden="true">›</span>
            </button>

            <button
              type="button"
              className={styles.themeToggle}
              role="switch"
              aria-checked="false"
              disabled
            >
              <span className={styles.menuIcon}>
                <Icon name="moon" />
              </span>
              <span className={styles.menuCopy}>
                <strong>Mørk tilstand</strong>
                <small>Slået fra</small>
              </span>
              <span className={styles.themeSwitch} aria-hidden="true">
                <span />
              </span>
            </button>

            <div className={styles.menuList}>
              {menuItems.map((item) => (
                <button
                  key={item.label}
                  type="button"
                  className={styles.menuItem}
                  disabled
                >
                  <span className={styles.menuIcon}>
                    <Icon name={item.icon} />
                  </span>
                  <span className={styles.menuCopy}>
                    <strong>{item.label}</strong>
                    <small>{item.detail}</small>
                  </span>
                  <span aria-hidden="true">›</span>
                </button>
              ))}
            </div>

            <button type="button" className={styles.helpLink} disabled>
              Hjælp og kontakt
            </button>
          </div>
        )}
      </section>
    </div>
  );
}

export default memo(MenuModal);
