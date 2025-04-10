// This script helps debug Supabase connection issues in the application
import dotenv from 'dotenv';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';

// Configure dotenv
dotenv.config({ path: './.env' });

// Initialize Supabase client with credentials from .env
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

console.log('=== Supabase Connection Troubleshooter ===');
console.log('Supabase URL:', supabaseUrl);
console.log('API Key length:', supabaseKey ? supabaseKey.length : 0);

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true
  }
});

// Check if client imports are configured properly
async function checkImports() {
  console.log('\n=== Checking Supabase Client Import ===');
  
  try {
    // Read the supabaseClient.ts file
    const clientPath = './src/services/supabaseClient.ts';
    if (fs.existsSync(clientPath)) {
      const clientFile = fs.readFileSync(clientPath, 'utf8');
      
      // Check if URL is hardcoded instead of using env
      if (clientFile.includes('const supabaseUrl = "')) {
        console.error('❌ The Supabase URL appears to be hardcoded in supabaseClient.ts');
        console.log('   Fix: Replace hardcoded URL with import.meta.env.VITE_SUPABASE_URL');
      } else {
        console.log('✅ Supabase URL is using environment variables');
      }
      
      // Check if API key is hardcoded
      if (clientFile.includes('const supabaseKey = "')) {
        console.error('❌ The Supabase API key appears to be hardcoded in supabaseClient.ts');
        console.log('   Fix: Replace hardcoded key with import.meta.env.VITE_SUPABASE_ANON_KEY');
      } else {
        console.log('✅ Supabase API key is using environment variables');
      }
      
      // Check for error handling
      if (!clientFile.includes('try {') || !clientFile.includes('catch')) {
        console.warn('⚠️ Missing proper error handling in supabaseClient.ts');
        console.log('   Recommendation: Add try/catch blocks for better error handling');
      } else {
        console.log('✅ Error handling exists in supabaseClient.ts');
      }
    } else {
      console.error('❌ Could not find supabaseClient.ts file');
    }
  } catch (err) {
    console.error('Error checking imports:', err);
  }
}

// Test connectivity
async function testConnection() {
  console.log('\n=== Testing Supabase Connection ===');
  
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('❌ Connection test failed:', error.message);
      console.log('   Possible cause: Network issue or invalid credentials');
      return false;
    }
    
    console.log('✅ Connection test successful!');
    return true;
  } catch (err) {
    console.error('❌ Connection test exception:', err.message);
    console.log('   Possible cause: Network issue or invalid credentials');
    return false;
  }
}

// Function to generate fixed supabaseClient.ts file
async function generateFixedClientFile() {
  console.log('\n=== Generating Fixed supabaseClient.ts File ===');
  
  const fixedClient = `import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials. Make sure to set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file');
}

// Create client
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Test the connection to check if it's working
(async () => {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error('Supabase connection test failed:', error);
    } else {
      console.log('Supabase connection test successful');
    }
  } catch (err) {
    console.error('Supabase connection test exception:', err);
  }
})();

// Export all the auth and user profile functions
// ... rest of your existing functions ...
`;

  try {
    fs.writeFileSync('./src/scripts/fixed-supabase-client.txt', fixedClient);
    console.log('✅ Generated fixed client file: src/scripts/fixed-supabase-client.txt');
    console.log('   You can use this as a reference to fix your supabaseClient.ts file');
  } catch (err) {
    console.error('❌ Failed to generate fixed client file:', err.message);
  }
}

// Main function
async function main() {
  // Check imports
  await checkImports();
  
  // Test connection
  const connected = await testConnection();
  
  // Generate fixed client file
  await generateFixedClientFile();
  
  // Summary and recommendations
  console.log('\n=== Summary and Recommendations ===');
  if (connected) {
    console.log('✅ Your Supabase connection is working correctly.');
    console.log('If you\'re still seeing errors in your application, check:');
    console.log('1. Make sure you\'re importing the Supabase client correctly in your components');
    console.log('2. Check if there are any browser console errors when your app loads');
    console.log('3. Verify that your Supabase client is initialized early in your application');
  } else {
    console.log('❌ Your Supabase connection is not working.');
    console.log('Please check:');
    console.log('1. Your .env file has the correct Supabase URL and API key');
    console.log('2. You have network connectivity to the Supabase servers');
    console.log('3. Your Supabase project is active and not in maintenance mode');
    console.log('4. Consider restarting your development server after fixing issues');
  }
  
  console.log('\nTo fix the Database tables are missing error, try:');
  console.log('1. Update your supabaseClient.ts file using the fixed version in src/scripts/fixed-supabase-client.txt');
  console.log('2. Clear your browser cache or use incognito mode to test');
  console.log('3. Restart your development server with npm run dev');
}

main().catch(err => {
  console.error('Unexpected error:', err);
}); 