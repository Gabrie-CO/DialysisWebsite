import { sentrySvelteKit } from "@sentry/sveltekit";
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import tailwindcss from '@tailwindcss/vite';
export default defineConfig({
  plugins: [sentrySvelteKit({
    org: "apexsoftware",
    project: "javascript-sveltekit"
  }), tailwindcss(), sveltekit()],
  server: {
    fs: {
      allow: ['convex']
    }
  }
});