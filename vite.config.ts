import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  build: {
    outDir: path.resolve(__dirname, 'backend/Server/wwwroot'),
    emptyOutDir: true,
    sourcemap: true,
  },
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5001'
    }
  }
});
