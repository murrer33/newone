-- Fix waitlist RLS policies
-- Run this in the Supabase SQL Editor

-- First, ensure the waitlist table exists with the correct structure
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT NOT NULL UNIQUE,
  name TEXT,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  referral_code TEXT UNIQUE,
  referred_by TEXT,
  preferred_plan TEXT DEFAULT '1',
  processed BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
DROP POLICY IF EXISTS "Allow anonymous insert to waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "anon_insert_policy" ON public.waitlist;
DROP POLICY IF EXISTS "select_all_policy" ON public.waitlist;
DROP POLICY IF EXISTS "service_role_all_policy" ON public.waitlist;

-- Create a policy that allows anonymous users to insert into the waitlist
CREATE POLICY "anon_insert_policy" ON public.waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create a policy that allows anonymous users to read from the waitlist
CREATE POLICY "anon_select_policy" ON public.waitlist
  FOR SELECT TO anon
  USING (true);

-- Create a policy that allows authenticated users to read from the waitlist
CREATE POLICY "auth_select_policy" ON public.waitlist
  FOR SELECT TO authenticated
  USING (true);

-- Create a policy that allows service role to do everything
CREATE POLICY "service_role_policy" ON public.waitlist
  FOR ALL TO service_role
  USING (true)
  WITH CHECK (true);

-- Grant necessary permissions
GRANT ALL ON public.waitlist TO anon;
GRANT ALL ON public.waitlist TO authenticated;
GRANT ALL ON public.waitlist TO service_role;

-- Verify the policies
SELECT * FROM pg_policies WHERE tablename = 'waitlist';

-- Verify the table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'waitlist'; 