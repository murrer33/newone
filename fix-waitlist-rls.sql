-- Fix waitlist RLS policies
-- Run this in the Supabase SQL Editor

-- First, disable RLS temporarily to fix the policies
ALTER TABLE public.waitlist DISABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow anonymous insert to waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "anon_insert_policy" ON public.waitlist;
DROP POLICY IF EXISTS "select_all_policy" ON public.waitlist;
DROP POLICY IF EXISTS "service_role_all_policy" ON public.waitlist;
DROP POLICY IF EXISTS "anon_select_policy" ON public.waitlist;
DROP POLICY IF EXISTS "auth_select_policy" ON public.waitlist;
DROP POLICY IF EXISTS "service_role_policy" ON public.waitlist;

-- Re-enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Create a single, simple policy for anonymous inserts
CREATE POLICY "anon_insert_policy" ON public.waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

-- Grant necessary permissions
GRANT INSERT ON public.waitlist TO anon;
GRANT SELECT ON public.waitlist TO anon;
GRANT ALL ON public.waitlist TO authenticated;
GRANT ALL ON public.waitlist TO service_role;

-- Verify the policies
SELECT * FROM pg_policies WHERE tablename = 'waitlist';

-- Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'waitlist'; 