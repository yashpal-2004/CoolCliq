-- CoolCliq: Presence Auto-Expiry System
-- This script should be run in the Supabase SQL Editor.
-- It automatically removes 'presence' records that are older than 90 minutes.

-- 1. Create the cleanup function
CREATE OR REPLACE FUNCTION delete_expired_presence()
RETURNS void AS $$
BEGIN
  DELETE FROM public.presence
  WHERE expires_at < NOW();
END;
$$ LANGUAGE plpgsql;

-- 2. Create a trigger that updates 'expires_at' on check-in
-- This ensures that every presence record has a 90-minute lifespan.
CREATE OR REPLACE FUNCTION set_presence_expiry()
RETURNS TRIGGER AS $$
BEGIN
  NEW.expires_at := NEW.checked_in_at + INTERVAL '90 minutes';
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_set_presence_expiry ON public.presence;
CREATE TRIGGER tr_set_presence_expiry
BEFORE INSERT ON public.presence
FOR EACH ROW
EXECUTE FUNCTION set_presence_expiry();

-- 3. (Optional) pg_cron support
-- If your Supabase instance has pg_cron enabled, you can automate this hourly:
-- SELECT cron.schedule('delete-expired-presence', '0 * * * *', 'SELECT delete_expired_presence()');

-- --- TRUST & SAFETY: GEO-VALIDATION HELPER ---
-- Function to calculate distance between two points (Haversine formula)
-- Used by the server to verify user is actually inside the venue radius.

CREATE OR REPLACE FUNCTION verify_presence_distance(
  user_lat FLOAT, 
  user_lng FLOAT, 
  venue_lat FLOAT, 
  venue_lng FLOAT, 
  max_radius_meters INT
) RETURNS BOOLEAN AS $$
DECLARE
  dist_meters FLOAT;
BEGIN
  dist_meters := 6371000 * acos(
    cos(radians(user_lat)) * cos(radians(venue_lat)) * cos(radians(venue_lng) - radians(user_lng)) +
    sin(radians(user_lat)) * sin(radians(venue_lat))
  );
  RETURN dist_meters <= max_radius_meters;
END;
$$ LANGUAGE plpgsql;
