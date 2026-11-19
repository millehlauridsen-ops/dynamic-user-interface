import { supabase } from "../lib/supabase.js";

export async function getUpcomingDepartures(stopId) {
  const { data, error } = await supabase.rpc("get_upcoming_departures", {
    p_stop_id: stopId,
  });

  if (error) {
    throw error;
  }

  return data ?? [];
}
