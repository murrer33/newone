# Supabase Setup for Feedback System

This document provides instructions on setting up Supabase to work with the feedback feature in our application.

## Prerequisites

1. Create a Supabase account at [https://supabase.com](https://supabase.com) if you don't have one already.
2. Create a new Supabase project.

## Configuration Steps

### 1. Set Environment Variables

Add your Supabase credentials to the `.env` file:

```
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
```

Replace `your-project-id` and `your-anon-key` with your actual Supabase project ID and anonymous key.

### 2. Create Database Tables

1. In your Supabase dashboard, go to the SQL Editor.
2. Copy and paste the SQL from the `supabase-setup.sql` file in this project.
3. Run the SQL script to create the necessary tables and set up row-level security.

The script will:
- Create a `feedbacks` table to store user feedback
- Set up indexes for efficient querying
- Configure Row Level Security (RLS) policies to ensure users can only access their own feedback

### 3. Authentication

Our application uses Firebase for authentication, but Supabase is used for storing feedback data. The integration works as follows:

1. Users authenticate with Firebase
2. Feedback is stored in both Firebase and Supabase
3. The Firebase user ID is used as the user_id in Supabase

### 4. Testing

To test if everything is set up correctly:

1. Login to the application
2. Go to your profile page
3. Submit a feedback
4. Check if the feedback appears in the "Your Previous Feedback" section
5. Verify in the Supabase dashboard that the feedback has been stored in the `feedbacks` table

## Troubleshooting

If feedback is not being stored in Supabase:

1. Check that the environment variables are set correctly
2. Verify that the Supabase tables were created successfully
3. Check the browser console for any error messages
4. Ensure your Supabase project has the correct permissions and policies

## Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript/introduction)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security) 