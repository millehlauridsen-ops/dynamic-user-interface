import { supabase } from "../lib/supabase.js";

export async function getStops() {
  const { data, error } = await supabase
    .from("gtfs_stops")
    .select("stop_id, stop_name, stop_lat, stop_lon")
    .gte("stop_lat", 56.14)
    .lte("stop_lat", 56.18)
    .gte("stop_lon", 10.17)
    .lte("stop_lon", 10.23)
    .limit(20);

  if (error) {
    console.error("Fejl ved hentning af stoppesteder:", error);
    return [];
  }

  return data;
}
