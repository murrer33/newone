-- Create the feedbacks table
CREATE TABLE IF NOT EXISTS feedbacks (
  id TEXT PRIMARY KEY,
  user_id TEXT NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comments TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create index on user_id for faster lookups
CREATE INDEX IF NOT EXISTS idx_feedbacks_user_id ON feedbacks(user_id);
CREATE INDEX IF NOT EXISTS idx_feedbacks_created_at ON feedbacks(created_at);

-- Create RLS (Row Level Security) policies
-- Enable RLS on the table
ALTER TABLE feedbacks ENABLE ROW LEVEL SECURITY;

-- Allow users to insert their own feedback
CREATE POLICY insert_own_feedback ON feedbacks 
  FOR INSERT 
  WITH CHECK (auth.uid()::text = user_id);

-- Allow users to select their own feedback
CREATE POLICY select_own_feedback ON feedbacks 
  FOR SELECT 
  USING (auth.uid()::text = user_id);

-- Allow admins to select all feedback
CREATE POLICY admin_select_all_feedback ON feedbacks 
  FOR SELECT 
  USING (auth.uid() IN (
    SELECT id FROM auth.users WHERE auth.users.is_admin = true
  )); 