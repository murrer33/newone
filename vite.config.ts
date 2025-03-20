import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['firebase/app', 'firebase/auth', 'firebase/firestore'], // Include Firebase dependencies
    exclude: ['lucide-react'], // Exclude lucide-react from dependency optimization
  },
  server: {
    port: 3000, // Set the development server port
    strictPort: true, // Ensure the port is strictly used
    open: true, // Automatically open the browser
  },
  build: {
    outDir: 'dist', // Output directory for the build
    assetsInlineLimit: 4096, // Inline assets smaller than 4KB
    sourcemap: true, // Generate source maps for debugging
    commonjsOptions: {
      include: [/firebase/, /node_modules/], // Ensure Firebase is processed by commonjs plugin
    },
  },
  define: {
    'process.env': {}, // Define process.env for compatibility
  },
});
