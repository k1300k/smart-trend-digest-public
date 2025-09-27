-- Drop existing overly permissive policies
DROP POLICY IF EXISTS "Allow public read access to settings" ON public.settings;
DROP POLICY IF EXISTS "Allow public insert to settings" ON public.settings;
DROP POLICY IF EXISTS "Allow public update to settings" ON public.settings;
DROP POLICY IF EXISTS "Allow public delete from settings" ON public.settings;

-- Create more restrictive policies
-- For now, since there's no authentication implemented yet, we'll restrict access
-- These policies will need to be updated once authentication is added

-- Temporarily disable all public access to protect email data
-- This table should only be accessible through authenticated requests or service role
CREATE POLICY "Restrict settings access" 
ON public.settings 
FOR ALL 
USING (false);

-- Add a comment to remind about updating policies when auth is implemented
COMMENT ON TABLE public.settings IS 'Contains sensitive email data. Policies must be updated to use auth.uid() when authentication is implemented.';