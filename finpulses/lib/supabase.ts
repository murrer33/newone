import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export const getActiveSubscription = async (userId: string) => {
  const { data: subscription, error } = await supabase
    .from('subscriptions')
    .select('*, prices(*, products(*))')
    .eq('user_id', userId)
    .eq('status', 'active')
    .single();

  if (error) {
    console.error('Error:', error.message);
    return null;
  }

  return subscription;
}; 