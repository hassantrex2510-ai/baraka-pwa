import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  // المسار يكون فارغاً عند البناء لـ Capacitor (Android) وفارغاً لجيتهاب عند الحاجة
  base: process.env.CAPACITOR_BUILD === 'true' ? '/' : '/baraka-pwa/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icons/icon-192.png', 'icons/icon-512.png'],
      manifest: {
        name: 'جمعية البركة - تسيير الماء',
        short_name: 'البركة',
        description: 'تطبيق تسيير عدادات الماء الصالح للشرب',
        start_url: '.',
        display: 'standalone',
        background_color: '#f5f7fa',
        theme_color: '#1565C0',
        dir: 'rtl',
        lang: 'ar',
        icons: [
          {
            src: 'icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable'
          },
          {
            src: 'icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: { cacheName: 'google-fonts-cache' }
          }
        ]
      }
    })
  ]
})
