-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  uid UUID PRIMARY KEY,
  email TEXT NOT NULL,
  display_name TEXT,
  username TEXT,
  photo_url TEXT,
  tokens INTEGER DEFAULT 0,
  referral_id TEXT UNIQUE,
  referred_by UUID REFERENCES public.users(uid),
  referral_count INTEGER DEFAULT 0,
  completed_quests JSONB DEFAULT '{}'::jsonb,
  last_feedback BIGINT,
  created_at BIGINT,
  updated_at BIGINT
);

-- Enable RLS on users table
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to see their own data
CREATE POLICY "Allow users to read their own data" ON public.users
  FOR SELECT USING (auth.uid() = uid);

-- Create policy to allow users to update their own data
CREATE POLICY "Allow users to update their own data" ON public.users
  FOR UPDATE USING (auth.uid() = uid);

-- Create policy to allow insert for the handle_new_user function
CREATE POLICY "Allow insert for new users" ON public.users
  FOR INSERT WITH CHECK (true);

-- Feedback table
CREATE TABLE IF NOT EXISTS public.feedbacks (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  rating INTEGER NOT NULL,
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  CONSTRAINT valid_rating CHECK (rating >= 1 AND rating <= 5)
);

-- Enable RLS on feedbacks table
ALTER TABLE public.feedbacks ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to insert their own feedback
CREATE POLICY "Allow users to insert their own feedback" ON public.feedbacks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create policy to allow users to see their own feedback
CREATE POLICY "Allow users to read their own feedback" ON public.feedbacks
  FOR SELECT USING (auth.uid() = user_id);

-- Create quests table
CREATE TABLE IF NOT EXISTS public.quests (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  token_reward INTEGER NOT NULL,
  type TEXT NOT NULL, -- 'daily', 'weekly', 'achievement'
  requirement JSONB NOT NULL,
  expires_at BIGINT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample quests data
INSERT INTO public.quests (id, title, description, token_reward, type, requirement, expires_at)
VALUES 
  ('daily-login', 'Daily Login', 'Log in to the app today', 5, 'daily', '{"type": "login", "count": 1}', extract(epoch from (now() + interval '1 day')) * 1000),
  ('weekly-feedback', 'Weekly Feedback', 'Provide feedback about your experience', 10, 'weekly', '{"type": "feedback", "count": 1}', extract(epoch from (now() + interval '7 days')) * 1000),
  ('view-5-stocks', 'Research Stocks', 'View details of 5 different stocks', 15, 'achievement', '{"type": "viewStock", "count": 5}', extract(epoch from (now() + interval '30 days')) * 1000)
ON CONFLICT (id) DO NOTHING;

-- Create subscription plans table
CREATE TABLE IF NOT EXISTS public.plans (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  features JSONB NOT NULL,
  is_default BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Sample plans data
INSERT INTO public.plans (id, name, price, features, is_default)
VALUES 
  ('free', 'Free Plan', 0.00, '["Basic stock analysis", "Daily market updates", "Email support"]', true),
  ('basic', 'Basic Plan', 9.99, '["Basic stock analysis", "Daily market updates", "Limited API calls", "Email support"]', false),
  ('intermediate', 'Intermediate Plan', 19.99, '["Advanced stock analysis", "Real-time market data", "Technical indicators", "Portfolio tracking", "Priority email support"]', false),
  ('advanced', 'Advanced Plan', 29.99, '["Premium stock analysis", "AI predictions", "Unlimited API calls", "Priority support", "Custom alerts", "Sentiment analysis", "Market insights"]', false)
ON CONFLICT (id) DO NOTHING;

-- Create subscriptions table
CREATE TABLE IF NOT EXISTS public.subscriptions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  plan_id TEXT REFERENCES public.plans(id) NOT NULL,
  status TEXT NOT NULL, -- 'active', 'canceled', 'expired'
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on subscriptions table
ALTER TABLE public.subscriptions ENABLE ROW LEVEL SECURITY;

-- Create policy to allow authenticated users to see their own subscriptions
CREATE POLICY "Allow users to read their own subscriptions" ON public.subscriptions
  FOR SELECT USING (auth.uid() = user_id);

-- Create policy to allow users to update their own subscriptions
CREATE POLICY "Allow users to update their own subscriptions" ON public.subscriptions
  FOR UPDATE USING (auth.uid() = user_id);

-- Create policy to allow users to insert their own subscriptions
CREATE POLICY "Allow users to insert their own subscriptions" ON public.subscriptions
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user creation and assign free plan
CREATE OR REPLACE FUNCTION public.handle_new_user_subscription()
RETURNS TRIGGER AS $$
DECLARE
  free_plan_id TEXT;
BEGIN
  -- Get the free plan ID
  SELECT id INTO free_plan_id FROM public.plans WHERE is_default = true LIMIT 1;
  
  -- If no free plan exists, use the first plan
  IF free_plan_id IS NULL THEN
    SELECT id INTO free_plan_id FROM public.plans LIMIT 1;
  END IF;
  
  -- Create a subscription for the new user
  IF free_plan_id IS NOT NULL THEN
    INSERT INTO public.subscriptions (
      user_id, 
      plan_id, 
      status, 
      current_period_start,
      current_period_end
    ) VALUES (
      NEW.id,
      free_plan_id,
      'active',
      NOW(),
      NOW() + interval '1 year'
    );
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger to handle new user subscriptions
CREATE TRIGGER on_auth_user_created_subscription
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user_subscription(); 