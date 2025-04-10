// This script helps verify environment variables in the browser
// Add this script to your entry HTML file temporarily

console.log("========== CHECKING ENVIRONMENT VARIABLES ==========");

// Check if running in browser or Node.js
if (typeof window !== 'undefined') {
  // Browser environment 
  console.log("Running in browser environment");
  
  // Check for import.meta.env availability (Vite specific)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    console.log("Vite env object exists:", Object.keys(import.meta.env)
      .filter(key => key.startsWith('VITE_'))
      .map(key => ({ key, length: import.meta.env[key] ? import.meta.env[key].length : 0 })));
    
    if (import.meta.env.VITE_SUPABASE_URL) {
      console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);
    } else {
      console.error("VITE_SUPABASE_URL is not defined in browser environment!");
    }
    
    if (import.meta.env.VITE_SUPABASE_ANON_KEY) {
      console.log("VITE_SUPABASE_ANON_KEY length:", import.meta.env.VITE_SUPABASE_ANON_KEY.length);
    } else {
      console.error("VITE_SUPABASE_ANON_KEY is not defined in browser environment!");
    }
  } else {
    console.error("import.meta.env is not available. Make sure this is running in a Vite environment.");
  }
} else {
  // Node.js environment
  console.log("Running in Node.js environment");
  
  if (process.env) {
    const supabaseVars = Object.keys(process.env)
      .filter(key => key.startsWith('VITE_'))
      .reduce((obj, key) => {
        obj[key] = process.env[key] ? process.env[key].length : 0;
        return obj;
      }, {});
    
    console.log("Environment variables with VITE_ prefix:", supabaseVars);
    
    if (process.env.VITE_SUPABASE_URL) {
      console.log("VITE_SUPABASE_URL:", process.env.VITE_SUPABASE_URL);
    } else {
      console.error("VITE_SUPABASE_URL is not defined in Node environment!");
    }
    
    if (process.env.VITE_SUPABASE_ANON_KEY) {
      console.log("VITE_SUPABASE_ANON_KEY length:", process.env.VITE_SUPABASE_ANON_KEY.length);
    } else {
      console.error("VITE_SUPABASE_ANON_KEY is not defined in Node environment!");
    }
  }
}

console.log("================= CHECK COMPLETE =================");

// Instructions:
// 1. Add this script to index.html temporarily:
//    <script type="module" src="/src/scripts/check-env-vars.js"></script>
// 2. Check browser console for environment variable information
// 3. Remove the script after debugging 