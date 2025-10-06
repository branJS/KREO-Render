import { defineConfig } from 'vite'

export default defineConfig({
  css: {
    postcss: './postcss.config.cjs',
  },
  server: {
    fs: {
      // Prevent Vite from reading configs from parent folders
      strict: true,
    },
  },
})