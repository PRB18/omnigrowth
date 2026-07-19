import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// Absolute base so nested routes (/app/prices) still load JS/CSS correctly on Netlify.
// Capacitor serves from https://localhost root, so '/' works there too.
export default defineConfig({
  plugins: [react()],
  base: '/',
})
