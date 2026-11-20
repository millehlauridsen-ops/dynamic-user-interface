// Farverne kommer fra det aktive CSS-tema.
// Vi ændrer kun kortets farver og synlighed, ikke vejenes bredder.
export function getMapStyles() {
  const styles = getComputedStyle(document.documentElement);
  const color = (name) => styles.getPropertyValue(name).trim();

  return [
    { elementType: "geometry", stylers: [{ color: color("--map__base") }] },

    // Landskab, bygninger og grønne områder
    { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: color("--map__alternate") }] },
    { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ color: color("--map__building") }] },
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: color("--map__park") }] },

    // Veje: naturlige Google Maps-bredder, men forskellige farver
    { featureType: "road", elementType: "geometry", stylers: [{ color: color("--map__roadmajor") }] },
    { featureType: "road.local", elementType: "geometry", stylers: [{ color: color("--map__road") }] },
    { featureType: "road.highway", elementType: "geometry.fill", stylers: [{ color: color("--map__highway") }] },
    { featureType: "road.highway", elementType: "geometry.stroke", stylers: [{ color: color("--map__roadborder") }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: color("--map__label") }] },
    { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },

    // Fjern visuel støj, men behold vejnavne og områders placering
    { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.neighborhood", elementType: "labels", stylers: [{ visibility: "off" }] },

    // Vand
    { featureType: "water", elementType: "geometry", stylers: [{ color: color("--map__water") }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: color("--map__label") }] },
  ];
}
