import { supabase } from "../lib/supabase.js";

export async function getTripSchedule(tripId, stopId, departureAt) {
  const { data, error } = await supabase.rpc("get_trip_stop_schedule", {
    p_trip_id: tripId,
    p_stop_id: stopId,
    p_departure_at: departureAt,
  });

  if (error) {
    throw error;
  }

  return data ?? [];
}
