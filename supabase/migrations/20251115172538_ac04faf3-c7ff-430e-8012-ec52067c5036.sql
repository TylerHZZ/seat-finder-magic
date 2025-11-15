-- Make user_id NOT NULL to prevent RLS bypass
-- This ensures that all reservations must have a valid user_id for RLS policies to work correctly

-- First, update any existing records with NULL user_id (if any) to prevent migration failure
-- Note: This should not happen in practice due to RLS INSERT policies requiring auth.uid()
UPDATE public.reservations 
SET user_id = auth.uid() 
WHERE user_id IS NULL;

-- Now make the column NOT NULL
ALTER TABLE public.reservations 
ALTER COLUMN user_id SET NOT NULL;

-- Add a comment to document this security requirement
COMMENT ON COLUMN public.reservations.user_id IS 'Required for RLS policies - must never be NULL';