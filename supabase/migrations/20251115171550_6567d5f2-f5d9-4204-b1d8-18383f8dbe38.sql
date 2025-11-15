-- Drop the existing overly permissive policy
DROP POLICY IF EXISTS "Users can view all reservations" ON public.reservations;

-- Create a new policy that only allows users to view their own reservations
CREATE POLICY "Users can view own reservations" 
ON public.reservations 
FOR SELECT 
USING (auth.uid() = user_id);

-- Create a security definer function for public seat availability
-- This returns only seat_id, building, floor, and status (no personal info)
CREATE OR REPLACE FUNCTION public.get_public_seat_availability()
RETURNS TABLE (
  seat_id TEXT,
  building TEXT,
  floor INTEGER,
  status TEXT
)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT 
    seat_id,
    building,
    floor,
    status
  FROM public.reservations
  WHERE status = 'occupied';
$$;

-- Grant execute permission to authenticated and anonymous users
GRANT EXECUTE ON FUNCTION public.get_public_seat_availability() TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_public_seat_availability() TO anon;