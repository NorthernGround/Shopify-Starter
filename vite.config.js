import { defineConfig } from 'vite';
import liveReload from 'vite-plugin-live-reload';
import { resolve } from 'path';
import { browserslistToTargets } from 'lightningcss';
import browserslist from 'browserslist';

// https://vitejs.dev/config
export default defineConfig({
  plugins: [
    liveReload([
      'src/**/*',
      'shopifytheme/layout/**/*',
      'shopifytheme/templates/**/*',
      'shopifytheme/assets/**/*',
    ]),
  ],

  root: '',

  build: {
    // output dir for production build
    outDir: resolve(__dirname, 'shopifytheme/assets'),
    emptyOutDir: false,

    // our entry
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/js/index.js'),
      },
      output: {
        entryFileNames: '[name].js',
        chunkFileNames: '[name].js',
        assetFileNames: '[name].[ext]',
      },
    },

    // minifying switch
    minify: true,
    write: true,

    cssMinify: 'lightningcss',
  },

  server: {
    proxy: {
      '/': {
        target: 'http://127.0.0.1:9292',
        secure: false,
        changeOrigin: true,
        autoRewrite: true,
      },
    },

    port: 8080,

    // serve over http
    https: false,

    hmr: {
      host: 'localhost',
    },
  },

  resolve: {
    alias: {
      '@@': resolve(__dirname, './src'),
      '@': resolve(__dirname, './src/js'),
    },
  },

  css: {
    transformer: 'lightningcss',
    lightningcss: {
      targets: browserslistToTargets(
        browserslist('last 2 versions, not dead, > 2%'),
      ),
      drafts: {
        customMedia: true,
      },
    },
  },
});
