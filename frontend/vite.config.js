import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // Load environment variables based on the current mode (development/production)
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    server: {
      host: '0.0.0.0',
      port: 5000,
      allowedHosts: true,
      proxy: {
        '/api': {
          // Use VITE_BACKEND_URL from environment, or fallback to dev default
          target: env.VITE_BACKEND_URL || 'http://0.0.0.0:8000',
          changeOrigin: true,
        },
      },
    },
  }
})
