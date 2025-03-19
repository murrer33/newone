import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
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
    target: 'es2015', // Target older browsers for better compatibility
    minify: 'terser', // Use terser for minification
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true
    }
  },
  define: {
    'process.env': {}, // Define process.env for compatibility
    'global': {}, // Define global for compatibility
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      'crypto': 'crypto-browserify',
    },
  },
});
