import { defineConfig } from 'vite';
import { resolve } from 'path';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';

export default defineConfig({
  input: {
    main: resolve(import.meta.dirname, 'src/js/main.js'),
    // plop: vite-entry
    cart: resolve(import.meta.dirname, 'src/css/cart.css'),
    'cart-drawer': resolve(import.meta.dirname, 'src/css/cart-drawer.css'),
    'cart-notification': resolve(
      import.meta.dirname,
      'src/css/cart-notification.css',
    ),
    collection: resolve(import.meta.dirname, 'src/css/collection.css'),
    'collection-hero': resolve(
      import.meta.dirname,
      'src/css/collection-hero.css',
    ),
    facets: resolve(import.meta.dirname, 'src/css/facets.css'),
    'gift-card': resolve(import.meta.dirname, 'src/css/gift-card.css'),
    password: resolve(import.meta.dirname, 'src/css/password.css'),
    product: resolve(import.meta.dirname, 'src/css/product.css'),
  },

  build: {
    outDir: resolve(import.meta.dirname, 'shopifytheme/assets'),
    emptyOutDir: false,
    cssCodeSplit: true,
    rolldownOptions: {
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
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
