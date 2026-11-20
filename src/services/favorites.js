const STORAGE_KEY = "midttrafik-favorites";

export function getFavorites() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    const favorites = saved ? JSON.parse(saved) : [];

    return Array.isArray(favorites) ? favorites : [];
  } catch (error) {
    console.error("Kunne ikke læse favoritter:", error);
    return [];
  }
}

export function isFavorite(stopId) {
  return getFavorites().some((stop) => stop.stop_id === stopId);
}

export function addFavorite(stop) {
  const favorites = getFavorites();

  if (favorites.some((item) => item.stop_id === stop.stop_id)) {
    return;
  }

  const updated = [
    ...favorites,
    {
      stop_id: stop.stop_id,
      stop_name: stop.stop_name,
      stop_lat: stop.stop_lat,
      stop_lon: stop.stop_lon,
    },
  ];

  saveFavorites(updated);
}

export function removeFavorite(stopId) {
  const updated = getFavorites().filter((stop) => stop.stop_id !== stopId);

  saveFavorites(updated);
}

function saveFavorites(favorites) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
    window.dispatchEvent(new Event("favorites-changed"));
  } catch (error) {
    console.error("Kunne ikke gemme favoritter:", error);
  }
}
