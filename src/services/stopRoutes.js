import { supabase } from "../lib/supabase.js";

export async function getStopRoutes(stopId) {
  const { data, error } = await supabase
    .from("gtfs_stop_routes")

    .select(
      "route_id, route_short_name, route_type, route_color, route_text_color, destinations",
    )

    .eq("stop_id", stopId)
    .order("route_short_name");

  if (error) {
    throw error;
  }

  return data ?? [];
}
