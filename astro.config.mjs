// @ts-check
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';
import cloudflare from '@astrojs/cloudflare';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  integrations: [
    react(),
    tailwind(),
    sitemap({
      i18n: {
        defaultLocale: 'en',
        locales: {
          en: 'en-GB',
          es: 'es',
        },
      },
    }),
  ],
  adapter: cloudflare({
    imageService: 'cloudflare-binding',
    imagesBindingName: 'IMAGES',
    sessionKVBindingName: 'SESSION',
    prerenderEnvironment: 'node',
  }),
  output: 'server',
  site: 'https://inferente.com',
  security: {
    checkOrigin: true,
  },
  vite: {
    build: {
      rollupOptions: {
        external: ['/pagefind/pagefind.js'],
      },
    },
  },
});
