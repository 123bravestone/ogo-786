import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      tailwindcss(), react()],
    define: {
      'process.env': env, // Load environment variables
    },
  };

})

// proxy: {
//   '/api': {
//     target: `${import.meta.env.VITE_APP_API_URL}`,
//     secure: false,
//   },
// },