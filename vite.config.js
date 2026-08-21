import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rollupOptions: {
      external: ['react-native-fs', 'fs']
    }
  },
  optimizeDeps: {
    exclude: ['jsmediatags']
  }
});
