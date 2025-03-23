import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  server: {
    port: 5173,
  },
  plugins: [
    tailwindcss(), react()],
})

// proxy: {
//   '/api': {
//     target: `${import.meta.env.VITE_APP_API_URL}`,
//     secure: false,
//   },
// },