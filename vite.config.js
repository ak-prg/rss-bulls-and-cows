import { defineConfig } from 'vite';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = fileURLToPath(new URL('.', import.meta.url));
const SRC = resolve(__dirname, 'src');

export default defineConfig({
  root: SRC,
  publicDir: resolve(__dirname, 'public'),
  server: { port: 5173, open: true },
  base: './',
  build: {
    sourcemap: true,
    minify: false,
    cssMinify: false,
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(SRC, 'index.html'),
      },
    },
  },
});
