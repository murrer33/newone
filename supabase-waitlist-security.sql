-- First, ensure the is_waitlisted column exists in the users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_waitlisted BOOLEAN DEFAULT TRUE;

-- Create a waitlist table for non-authenticated users
CREATE TABLE IF NOT EXISTS public.waitlist (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  uid UUID DEFAULT uuid_generate_v4() UNIQUE,
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

-- Create index on waitlist email and uid
CREATE INDEX IF NOT EXISTS idx_waitlist_email ON public.waitlist(email);
CREATE INDEX IF NOT EXISTS idx_waitlist_uid ON public.waitlist(uid);
CREATE INDEX IF NOT EXISTS idx_waitlist_referral_code ON public.waitlist(referral_code);

-- Enable RLS
ALTER TABLE public.waitlist ENABLE ROW LEVEL SECURITY;

-- Drop all existing policies
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

-- Grant necessary permissions
GRANT INSERT ON public.waitlist TO anon;
GRANT SELECT ON public.waitlist TO anon;
GRANT ALL ON public.waitlist TO authenticated;
GRANT ALL ON public.waitlist TO service_role;

-- Create a function to generate a unique uid for waitlist entries
CREATE OR REPLACE FUNCTION generate_waitlist_uid()
RETURNS UUID AS $$
BEGIN
  RETURN uuid_generate_v4();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verify the policies
SELECT * FROM pg_policies WHERE tablename = 'waitlist';

-- Update existing policies or create new ones for each table that should be restricted

-- Update users table policies
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
CREATE POLICY "Users can always view their own data" ON public.users
  FOR SELECT USING (auth.uid() = uid);

DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
CREATE POLICY "Users can update their own data if not waitlisted" ON public.users
  FOR UPDATE USING (auth.uid() = uid AND public.is_not_waitlisted());

-- Feedbacks table policies
DROP POLICY IF EXISTS "Allow users to insert their own feedback" ON public.feedbacks;
CREATE POLICY "Allow users to insert their own feedback if not waitlisted" ON public.feedbacks
  FOR INSERT WITH CHECK (auth.uid() = user_id AND public.is_not_waitlisted());

DROP POLICY IF EXISTS "Allow users to read their own feedback" ON public.feedbacks;
CREATE POLICY "Allow users to read their own feedback if not waitlisted" ON public.feedbacks
  FOR SELECT USING (auth.uid() = user_id AND public.is_not_waitlisted());

-- Quests table policies
DROP POLICY IF EXISTS "Users can view quests" ON public.quests;
CREATE POLICY "Users can view quests if not waitlisted" ON public.quests
  FOR SELECT USING (public.is_not_waitlisted());

-- Subscriptions table policies
DROP POLICY IF EXISTS "Allow users to read their own subscriptions" ON public.subscriptions;
CREATE POLICY "Allow users to read their own subscriptions if not waitlisted" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id AND public.is_not_waitlisted());

DROP POLICY IF EXISTS "Allow users to update their own subscriptions" ON public.subscriptions;
CREATE POLICY "Allow users to update their own subscriptions if not waitlisted" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id AND public.is_not_waitlisted());

DROP POLICY IF EXISTS "Allow users to insert their own subscriptions" ON public.subscriptions;
CREATE POLICY "Allow users to insert their own subscriptions if not waitlisted" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id AND public.is_not_waitlisted());

-- Allow public access to plans table for viewing
DROP POLICY IF EXISTS "Allow users to view subscription plans" ON public.plans;
CREATE POLICY "Allow public to view subscription plans" ON public.plans
  FOR SELECT USING (true);

-- Update plans table with new values
TRUNCATE TABLE public.plans RESTART IDENTITY CASCADE;
INSERT INTO public.plans (id, name, price, features, is_default)
VALUES 
  ('1', 'Free Plan', 0.00, '["Basic stock analysis", "Daily market updates", "Email support"]', true),
  ('2', 'Premium Plan', 9.99, '["Advanced stock analysis", "Real-time market updates", "Priority support"]', false),
  ('3', 'Pro Plan', 19.99, '["AI predictions", "Custom reports", "Expert support"]', false);

-- Helper function to check waitlist status for the current user
CREATE OR REPLACE FUNCTION public.get_waitlist_status()
RETURNS BOOLEAN AS $$
DECLARE
  is_user_waitlisted BOOLEAN;
BEGIN
  -- Get the waitlist status for the current authenticated user
  SELECT is_waitlisted INTO is_user_waitlisted
  FROM public.users
  WHERE uid = auth.uid();
  
  -- Return the value (NULL becomes null)
  RETURN is_user_waitlisted;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create an admin function to update waitlist status
CREATE OR REPLACE FUNCTION public.admin_update_waitlist_status(user_id UUID, new_status BOOLEAN)
RETURNS BOOLEAN AS $$
DECLARE
  is_admin BOOLEAN;
BEGIN
  -- Check if the current user is an admin
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE uid = auth.uid() AND is_admin = TRUE
  ) INTO is_admin;
  
  -- Only admins can update waitlist status
  IF is_admin THEN
    UPDATE public.users
    SET 
      is_waitlisted = new_status,
      updated_at = extract(epoch from now()) * 1000
    WHERE uid = user_id;
    
    RETURN TRUE;
  ELSE
    RETURN FALSE;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create an admin view for waitlist management
CREATE OR REPLACE VIEW admin_waitlist_view AS
SELECT 
  w.id,
  w.email,
  w.name,
  w.preferred_plan,
  w.joined_at,
  w.referral_code,
  w.referred_by,
  w.processed,
  w.created_at,
  p.name as plan_name,
  p.price as plan_price
FROM public.waitlist w
LEFT JOIN public.plans p ON w.preferred_plan = p.id
ORDER BY w.joined_at ASC; 