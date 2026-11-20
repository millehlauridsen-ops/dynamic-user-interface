import { supabase } from "../lib/supabase.js";

//søger efter ruter i databasen
export async function searchRoutes(query) {
  const searchTerm = query.trim();

  if (!searchTerm) return [];

  const { data, error } = await supabase
    .from("gtfs_routes")
    .select("route_id, route_short_name, route_long_name")
    .ilike("route_short_name", `%${searchTerm}%`)
    .order("route_short_name")
    .limit(30);

  if (error) {
    throw error;
  }

  return data ?? [];
}

export async function getRoutesForStops(stopIds) {
  if (stopIds.length === 0) return [];

  const { data, error } = await supabase.rpc("get_routes_for_stops", {
    p_stop_ids: [...new Set(stopIds.map(String))],
  });

  if (error) {
    throw error;
  }

  return data ?? [];
}
