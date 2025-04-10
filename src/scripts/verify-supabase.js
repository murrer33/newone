// Load environment variables from .env
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';

// Configure dotenv
dotenv.config({ path: './.env' });

// Initialize Supabase client with credentials from .env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('Environment variables:');
console.log('Process env:', Object.keys(process.env).filter(key => key.startsWith('VITE_')));
console.log('VITE_SUPABASE_URL:', supabaseUrl);
console.log('VITE_SUPABASE_ANON_KEY length:', supabaseKey ? supabaseKey.length : 0);

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
  process.exit(1);
}

if (supabaseUrl === 'https://your-project-id.supabase.co' || 
    supabaseUrl.includes('your-supabase-project-url')) {
  console.error('⚠️ You need to update the VITE_SUPABASE_URL in your .env file with your actual Supabase URL');
  console.error('Your current URL is set to:', supabaseUrl);
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Tables to check
const tablesToCheck = ['users', 'feedbacks', 'quests', 'plans', 'subscriptions'];

async function checkConnection() {
  try {
    // Test basic connection
    console.log('Testing Supabase connection...');
    console.log(`Connecting to: ${supabaseUrl}`);
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Failed to connect to Supabase:', error.message);
      return false;
    }
    
    console.log('✅ Successfully connected to Supabase!');
    return true;
  } catch (err) {
    console.error('❌ Error connecting to Supabase:', err.message);
    return false;
  }
}

async function checkTable(tableName) {
  try {
    const { data, error, status } = await supabase.from(tableName).select('count', { count: 'exact', head: true });
    
    if (error) {
      if (status === 404) {
        console.error(`❌ Table '${tableName}' does not exist`);
      } else {
        console.error(`❌ Error checking table '${tableName}':`, error.message);
      }
      return false;
    }
    
    console.log(`✅ Table '${tableName}' exists`);
    return true;
  } catch (err) {
    console.error(`❌ Error checking table '${tableName}':`, err.message);
    return false;
  }
}

async function main() {
  console.log('=== Supabase Connection Verification ===');
  
  // First check connection
  const connected = await checkConnection();
  if (!connected) {
    console.error('Unable to connect to Supabase. Please check your credentials and network connection.');
    process.exit(1);
  }
  
  console.log('\n=== Checking Required Tables ===');
  
  // Check each table
  const results = {};
  for (const tableName of tablesToCheck) {
    results[tableName] = await checkTable(tableName);
  }
  
  // Summary
  console.log('\n=== Summary ===');
  let allTablesExist = true;
  for (const [table, exists] of Object.entries(results)) {
    console.log(`${exists ? '✅' : '❌'} ${table}`);
    if (!exists) allTablesExist = false;
  }
  
  if (!allTablesExist) {
    console.log('\n⚠️ Some required tables are missing. Please run the SQL script from supabase-tables.sql in your Supabase SQL editor.');
    console.log('\nInstructions:');
    console.log('1. Log in to your Supabase dashboard at https://app.supabase.com');
    console.log('2. Select your project');
    console.log('3. Go to the SQL Editor section');
    console.log('4. Create a new query');
    console.log('5. Paste the entire contents of your supabase-tables.sql file');
    console.log('6. Run the query');
    process.exit(1);
  } else {
    console.log('\n✅ All required tables exist!');
  }
}

main().catch(err => {
  console.error('Unexpected error:', err);
  process.exit(1);
}); 