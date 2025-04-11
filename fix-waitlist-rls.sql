-- Fix waitlist RLS policies
-- Run this in the Supabase SQL Editor

-- Drop existing policies first
DROP POLICY IF EXISTS "Allow anonymous insert to waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "anon_insert_policy" ON public.waitlist;
DROP POLICY IF EXISTS "select_all_policy" ON public.waitlist;
DROP POLICY IF EXISTS "service_role_all_policy" ON public.waitlist;

-- Create clear policy for anonymous users to insert
CREATE POLICY "anon_insert_policy" ON public.waitlist
  FOR INSERT TO anon
  WITH CHECK (true);
  
-- Create a policy to allow everyone to read the waitlist table
CREATE POLICY "select_all_policy" ON public.waitlist
  FOR SELECT
  USING (true);

-- Allow service role to do all operations
CREATE POLICY "service_role_all_policy" ON public.waitlist
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Verify the waitlist table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'waitlist';

-- Show the current policies
SELECT * FROM pg_policies WHERE tablename = 'waitlist'; 