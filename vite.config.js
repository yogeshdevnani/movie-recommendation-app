import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'

dotenv.config()

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true,
    proxy: {
      '/api/omdb': {
        target: 'https://www.omdbapi.com',
        changeOrigin: true,
        rewrite: (path) => {
          const key = process.env.OMDB_API_KEY
          const incoming = path.replace(/^\/api\/omdb/, '') || '/'
          try {
            const url = new URL(incoming, 'https://www.omdbapi.com')
            if (!url.searchParams.has('apikey') && key) {
              url.searchParams.set('apikey', key)
            }
            return url.pathname + (url.search ? url.search : '')
          } catch (_) {
            // fallback: append key naively if possible
            if (key) {
              const hasQuery = incoming.includes('?')
              const sep = hasQuery ? '&' : '?'
              return incoming + sep + 'apikey=' + key
            }
            return incoming
          }
        }
      }
    }
  }
})
