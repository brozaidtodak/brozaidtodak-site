import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      output: {
        // p3 — asingkan pustaka yang jarang berubah dari kod app yang
        // kerap berubah. Tujuannya cache: ship sekali, pelawat berulang
        // tak muat turun React/GSAP lagi walaupun kod laman dikemas kini.
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-gsap': ['gsap'],
          // Dinamakan supaya ia tak muncul sebagai "index-*.js" kedua yang
          // mengelirukan dalam output build. Ia tetap lazy: hanya /login dan
          // pokok /dashboard yang import dia.
          'vendor-supabase': ['@supabase/supabase-js'],
        },
      },
    },
  },
})
