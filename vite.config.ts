import { fileURLToPath, URL } from 'node:url';

import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import vueDevTools from 'vite-plugin-vue-devtools';
import svgLoader from 'vite-svg-loader';
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
   base: '/chess-puzzles/',
   plugins: [
      vue(),
      vueDevTools(),
      svgLoader(),
      VitePWA({
         registerType: 'prompt',
         injectRegister: false,

         pwaAssets: {
            disabled: false,
            config: true,
         },

         manifest: {
            name: 'Chess Puzzles',
            short_name: 'Chess Puzzles',
            description: 'A simple game of Chess puzzles',
            background_color: '#1f1f1f',
            theme_color: '#2a2a2a',
         },

         workbox: {
            globPatterns: ['**/*.{js,css,html,svg,png,ico}'],
            cleanupOutdatedCaches: true,
            clientsClaim: true,
         },

         devOptions: {
            enabled: false,
            navigateFallback: 'index.html',
            suppressWarnings: true,
            type: 'module',
         },
      }),
   ],
   resolve: {
      alias: {
         '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
   },
});
