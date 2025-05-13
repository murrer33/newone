-- SQL to disable waitlisting for all users

-- Check if the is_waitlisted column exists, add it if it doesn't
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT FROM information_schema.columns 
    WHERE table_name = 'users' AND column_name = 'is_waitlisted'
  ) THEN
    ALTER TABLE public.users ADD COLUMN is_waitlisted BOOLEAN DEFAULT FALSE;
  END IF;
END
$$;

-- Set is_waitlisted to FALSE for all users
UPDATE public.users SET is_waitlisted = FALSE;

-- Set all new users to not be waitlisted by default
ALTER TABLE public.users ALTER COLUMN is_waitlisted SET DEFAULT FALSE;

-- Ensure that the RLS policy is updated to allow access to is_waitlisted column
-- for authenticated users
DROP POLICY IF EXISTS "Allow users to read their own data" ON public.users;
CREATE POLICY "Allow users to read their own data" ON public.users
  FOR SELECT USING (auth.uid() = uid);

-- Commit the changes
COMMIT; 