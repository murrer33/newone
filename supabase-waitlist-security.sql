-- First, ensure the is_waitlisted column exists in the users table
ALTER TABLE public.users ADD COLUMN IF NOT EXISTS is_waitlisted BOOLEAN DEFAULT TRUE;

-- Create a helper function to check if a user is not waitlisted
CREATE OR REPLACE FUNCTION public.is_not_waitlisted()
RETURNS BOOLEAN AS $$
DECLARE
  is_user_waitlisted BOOLEAN;
BEGIN
  -- Get the waitlist status for the current authenticated user
  SELECT is_waitlisted INTO is_user_waitlisted
  FROM public.users
  WHERE uid = auth.uid();
  
  -- If user doesn't exist or is_waitlisted is NULL, default to true (restricted)
  -- Otherwise, return the negated value of is_waitlisted
  RETURN COALESCE(NOT is_user_waitlisted, FALSE);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

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

-- Plans table policies (read-only for non-waitlisted users)
DROP POLICY IF EXISTS "Allow users to view subscription plans" ON public.plans;
CREATE POLICY "Allow users to view subscription plans if not waitlisted" ON public.plans
  FOR SELECT USING (public.is_not_waitlisted());

-- Update plans table with new values
TRUNCATE TABLE public.plans RESTART IDENTITY CASCADE;
INSERT INTO public.plans (id, name, price, features, is_default)
VALUES 
  ('1', 'Free Plan', 0.00, '["Basic stock analysis", "Daily market updates", "Email support"]', true),
  ('2', 'Premium Plan', 9.99, '["Advanced stock analysis", "Real-time market updates", "Priority support"]', false),
  ('3', 'Pro Plan', 19.99, '["AI predictions", "Custom reports", "Expert support"]', false);

-- Create a special policy to always allow access to the waitlist page
-- This is a placeholder - you would typically implement this in your frontend code
-- by checking the is_waitlisted flag from the user's profile

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