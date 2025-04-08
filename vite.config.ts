import { sentryVitePlugin } from '@sentry/vite-plugin'
import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite' // Keep defineConfig
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
// Export a function to access environment variables
export default defineConfig(({ mode }) => {
  // Check if building in Cloudflare Pages environment
  // process.env.CF_PAGES is set to '1' by Cloudflare Pages build environment
  const isCloudflare = process.env.CF_PAGES === '1';
  // Set base URL dynamically
  const base = isCloudflare ? '/' : '/v-hnews/'; // Use root for Cloudflare, specific path otherwise

  // Log the determined environment and base URL for verification during build
  console.log(`[vite.config.ts] Building for: ${isCloudflare ? 'Cloudflare Pages' : 'Other (GitHub Pages/Local)'}`);
  console.log(`[vite.config.ts] Setting base URL to: ${base}`);

  return {
    server: {
      host: true
    },
    plugins: [
      vue(),
      vueDevTools(),
      tailwindcss(),
      sentryVitePlugin({
        org: 'envious',
        project: 'javascript-vue',
        authToken: process.env.SENTRY_AUTH_TOKEN,
      }),
    ],

    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)), // Keep existing alias
      },
    },
    define: {
      // Keep or adjust 'process.env': {} as needed for your application code
      // It doesn't directly affect the CF_PAGES check above which uses the actual process.env
      'process.env': {},
    },
    build: {
      sourcemap: true, // Keep source maps enabled
    },
    base: base, // Apply the dynamically determined base URL
  }
})
