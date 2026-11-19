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
