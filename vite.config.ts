import { defineConfig } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config = defineConfig({
  root: 'demo',
  publicDir: 'public',
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
      'headset-manager': path.resolve(__dirname, 'src/index.ts'),
    },
  },
});

export default config;
