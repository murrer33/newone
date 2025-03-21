import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  optimizeDeps: {
    include: ['firebase', 'firebase/app', 'firebase/auth', 'firebase/firestore']
  },
  build: {
    outDir: 'dist',
    sourcemap: true
  }
});
