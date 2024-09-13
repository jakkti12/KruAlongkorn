import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify';
import dotenv from 'dotenv';
dotenv.config();

export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: true },
  build: {
    transpile: ['vuetify'],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook('vite:extendConfig', (config) => {
        // @ts-expect-error
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    //...
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  css: [
    'bootstrap/dist/css/bootstrap.min.css',
    '~/assets/css/bootstrap.min.css',
    '~/assets/css/custom.css',
    '~/assets/icons/bootstrap-icons.css'
  ],
  plugins: [
    { src: '~/plugins/bootstrap.client.js', mode: 'client' },
    { src: '~/plugins/auth.ts', mode: 'client' }
  ],
});