-- Forum database tables

-- Table for forum posts
CREATE TABLE IF NOT EXISTS public.forum_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  stock_symbol TEXT,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER DEFAULT 0,
  is_advisor_post BOOLEAN DEFAULT FALSE
);

-- Table for forum comments
CREATE TABLE IF NOT EXISTS public.forum_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID REFERENCES public.forum_posts(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  likes INTEGER DEFAULT 0
);

-- Table for advisor verification
CREATE TABLE IF NOT EXISTS public.financial_advisors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) UNIQUE NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verification_date TIMESTAMP WITH TIME ZONE,
  license_number TEXT,
  verified_by UUID REFERENCES auth.users(id),
  credentials TEXT,
  years_experience INTEGER,
  specialty TEXT,
  bio TEXT,
  profile_image TEXT,
  contact_email TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for fast lookups
CREATE INDEX IF NOT EXISTS idx_forum_posts_stock_symbol ON public.forum_posts(stock_symbol);
CREATE INDEX IF NOT EXISTS idx_forum_posts_user_id ON public.forum_posts(user_id);
CREATE INDEX IF NOT EXISTS idx_forum_posts_is_advisor ON public.forum_posts(is_advisor_post);
CREATE INDEX IF NOT EXISTS idx_forum_comments_post_id ON public.forum_comments(post_id);
CREATE INDEX IF NOT EXISTS idx_forum_comments_user_id ON public.forum_comments(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_advisors_user_id ON public.financial_advisors(user_id);
CREATE INDEX IF NOT EXISTS idx_financial_advisors_is_verified ON public.financial_advisors(is_verified);

-- RLS policies for forum_posts
ALTER TABLE public.forum_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read forum posts" 
ON public.forum_posts FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create forum posts" 
ON public.forum_posts FOR INSERT 
TO authenticated
WITH CHECK (
  -- For advisor posts, check if user is a verified advisor
  (NOT is_advisor_post) OR 
  (is_advisor_post AND EXISTS (
    SELECT 1 FROM public.financial_advisors 
    WHERE user_id = auth.uid() AND is_verified = true
  ))
);

CREATE POLICY "Users can update their own forum posts" 
ON public.forum_posts FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own forum posts" 
ON public.forum_posts FOR DELETE 
TO authenticated
USING (user_id = auth.uid());

-- RLS policies for forum_comments
ALTER TABLE public.forum_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read forum comments" 
ON public.forum_comments FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create forum comments" 
ON public.forum_comments FOR INSERT 
TO authenticated
WITH CHECK (true);

CREATE POLICY "Users can update their own forum comments" 
ON public.forum_comments FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete their own forum comments" 
ON public.forum_comments FOR DELETE 
TO authenticated
USING (user_id = auth.uid());

-- RLS policies for financial_advisors
ALTER TABLE public.financial_advisors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read financial advisors" 
ON public.financial_advisors FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can request advisor status" 
ON public.financial_advisors FOR INSERT 
TO authenticated
WITH CHECK (user_id = auth.uid() AND NOT is_verified);

CREATE POLICY "Advisors can update their own profiles" 
ON public.financial_advisors FOR UPDATE 
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid() AND NOT is_verified_changed());

-- Function to check if is_verified was changed
CREATE OR REPLACE FUNCTION is_verified_changed() 
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (NEW.is_verified IS DISTINCT FROM OLD.is_verified);
END;
$$ LANGUAGE plpgsql;

-- Create policy for admin to verify advisors
CREATE POLICY "Admins can verify advisors" 
ON public.financial_advisors FOR UPDATE 
TO authenticated
USING (EXISTS (
  SELECT 1 FROM public.users 
  WHERE uid = auth.uid() AND role = 'admin'
))
WITH CHECK (EXISTS (
  SELECT 1 FROM public.users 
  WHERE uid = auth.uid() AND role = 'admin'
));

-- Sample data
INSERT INTO public.forum_posts (user_id, stock_symbol, title, content, is_advisor_post)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'AAPL', 'Apple Q3 Earnings Discussion', 'What do you think about Apple''s latest earnings report?', false),
  ('00000000-0000-0000-0000-000000000002', 'TSLA', 'Tesla Future Outlook', 'Analysis of Tesla''s growth potential over the next 5 years.', true),
  ('00000000-0000-0000-0000-000000000003', 'MSFT', 'Microsoft Cloud Strategy', 'Discussion on Microsoft''s cloud business segment.', false),
  ('00000000-0000-0000-0000-000000000004', NULL, 'Market Forecast 2024', 'Comprehensive analysis of market trends for 2024.', true)
ON CONFLICT DO NOTHING;

INSERT INTO public.forum_comments (post_id, user_id, content)
VALUES 
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000005', 'Great analysis, thanks for sharing!'),
  ('00000000-0000-0000-0000-000000000010', '00000000-0000-0000-0000-000000000006', 'I disagree with point #3, here''s why...'),
  ('00000000-0000-0000-0000-000000000011', '00000000-0000-0000-0000-000000000007', 'Interesting perspective on Tesla.')
ON CONFLICT DO NOTHING; 