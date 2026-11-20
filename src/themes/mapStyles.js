// Google Maps' JSON-styling bruger farver fra appens aktive CSS-tema.
// Vi ændrer kun farver og synlighed – aldrig vejenes bredde eller kortets zoom.
export function getMapStyles() {
  const rootStyles = getComputedStyle(document.documentElement);
  const color = (name) => rootStyles.getPropertyValue(name).trim();

  return [
    { elementType: "geometry", stylers: [{ color: color("--map__base") }] },
    { featureType: "landscape.natural", elementType: "geometry", stylers: [{ color: color("--map__alternate") }] },
    { featureType: "landscape.man_made", elementType: "geometry", stylers: [{ color: color("--map__building") }] },
    { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "poi.park", elementType: "geometry", stylers: [{ color: color("--map__alternate") }] },
    { featureType: "transit", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "road", elementType: "geometry", stylers: [{ color: color("--map__roadmajor") }] },
    { featureType: "road.local", elementType: "geometry", stylers: [{ color: color("--map__road") }] },
    { featureType: "road", elementType: "labels.text.fill", stylers: [{ color: color("--map__label") }] },
    { featureType: "road", elementType: "labels.icon", stylers: [{ visibility: "off" }] },
    { featureType: "administrative.neighborhood", elementType: "labels", stylers: [{ visibility: "off" }] },
    { featureType: "water", elementType: "geometry", stylers: [{ color: color("--map__water") }] },
    { featureType: "water", elementType: "labels.text.fill", stylers: [{ color: color("--map__label") }] },
  ];
}
