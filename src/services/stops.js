import { supabase } from "../lib/supabase.js";

export async function getStops(bounds) {
  const { data, error } = await supabase
    .from("gtfs_stops")
    .select("stop_id, stop_name, stop_lat, stop_lon")
    .gte("stop_lat", bounds.south)
    .lte("stop_lat", bounds.north)
    .gte("stop_lon", bounds.west)
    .lte("stop_lon", bounds.east)
    .order("stop_id")
    .limit(300);

  if (error) {
    throw error;
  }

  return data;
}

//søgefunktionen
export async function searchStops(query) {
  const searchTerm = query.trim();

  if (!searchTerm) return [];

  const { data, error } = await supabase
    .from("gtfs_stops")
    .select("stop_id, stop_name, stop_lat, stop_lon")
    .ilike("stop_name", `%${searchTerm}%`)
    .order("stop_name")
    .limit(30);

  if (error) {
    throw error;
  }

  return data ?? [];
}

//funktion til at finde nærliggende stoppesteder
export async function getNearbyStops(latitude, longitude) {
  const radius = 0.015;

  const bounds = {
    north: latitude + radius,
    south: latitude - radius,
    east: longitude + radius,
    west: longitude - radius,
  };

  const stops = await getStops(bounds);

  const toRadians = (degrees) => (degrees * Math.PI) / 180;

  const getDistance = (stop) => {
    const earthRadius = 6371000;

    const latDifference = toRadians(stop.stop_lat - latitude);
    const lonDifference = toRadians(stop.stop_lon - longitude);

    const a =
      Math.sin(latDifference / 2) ** 2 +
      Math.cos(toRadians(latitude)) *
        Math.cos(toRadians(stop.stop_lat)) *
        Math.sin(lonDifference / 2) ** 2;

    return 2 * earthRadius * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  };

  return stops
    .map((stop) => ({
      ...stop,
      distance: getDistance(stop),
    }))
    .filter((stop) => stop.distance <= 1000)
    .sort((a, b) => a.distance - b.distance)
    .slice(0, 4); // Returner de 4 nærmeste stoppesteder
}
