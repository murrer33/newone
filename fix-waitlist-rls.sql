-- Fix waitlist RLS policies
-- Run this in the Supabase SQL Editor

-- First, ensure the waitlist table exists with the correct structure
-- Drop and recreate table to ensure structure is correct
DROP TABLE IF EXISTS public.waitlist;

CREATE TABLE public.waitlist (
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

-- Create indexes
CREATE INDEX idx_waitlist_email ON public.waitlist(email);
CREATE INDEX idx_waitlist_referral_code ON public.waitlist(referral_code);

-- Set up RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Drop existing policies first
DROP POLICY IF EXISTS "Allow anonymous insert to waitlist" ON public.waitlist;
DROP POLICY IF EXISTS "anon_insert_policy" ON public.waitlist;
DROP POLICY IF EXISTS "select_all_policy" ON public.waitlist;
DROP POLICY IF EXISTS "service_role_all_policy" ON public.waitlist;
DROP POLICY IF EXISTS "anon_select_policy" ON public.waitlist;
DROP POLICY IF EXISTS "auth_select_policy" ON public.waitlist;
DROP POLICY IF EXISTS "service_role_policy" ON public.waitlist;

-- Create a single, simple policy for anonymous inserts
CREATE POLICY "anon_insert_policy" ON public.waitlist
  FOR INSERT TO anon
  WITH CHECK (true);

-- Create a policy for anonymous selects
CREATE POLICY "anon_select_policy" ON public.waitlist
  FOR SELECT TO anon
  USING (true);

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