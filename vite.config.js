import { defineConfig } from 'vite';
import { resolve } from 'path';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';

export default defineConfig({
  input: { custom: resolve(import.meta.dirname, 'src/js/index.js') },

  build: {
    outDir: resolve(import.meta.dirname, 'shopifytheme/assets'),
    emptyOutDir: false,
    cssCodeSplit: false,
    rolldownOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: (assetInfo) =>
          assetInfo.name?.endsWith('.css') ? 'custom.css' : '[name].[ext]',
      },
    },
  },

  resolve: {
    alias: {
      '@@': resolve(import.meta.dirname, 'src'),
      '@': resolve(import.meta.dirname, 'src/js'),
    },
  },

  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(
        browserslist('last 2 versions, not dead, > 2%'),
      ),
      drafts: { customMedia: true },
    },
  },
});
