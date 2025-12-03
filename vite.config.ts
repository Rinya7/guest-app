import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// Це важливо → щоб PWA працювала і локально, і в продакшені
// В vite.config.ts можна використовувати process.env, бо це Node.js середовище
const API_BASE = process.env.VITE_API_BASE_URL || "http://localhost:3000";

export default defineConfig({
  plugins: [
    vue(),
    // ---------------------------
    // PWA Плагін
    // ---------------------------
    VitePWA({
      registerType: "autoUpdate",
      // Файли, які додаються в корінь продакшена
      includeAssets: [
        "favicon.ico",
        "apple-touch-icon.png",
        "mask-icon.svg",
      ],
      // Service Worker (Workbox)
      workbox: {
        // Кешує всі js/css/html/svg/png
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        // Runtime caching — те, що PWA ловить в процесі роботи
        runtimeCaching: [
          // -----------------------------
          // Кеш картинок (оптимально)
          // -----------------------------
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 днів
              },
            },
          },
          // -----------------------------
          // Кеш API бекенду Guest
          // -----------------------------
          {
            // ВАЖЛИВО: ловимо запити саме на твій бекенд
            urlPattern: new RegExp(`${API_BASE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/guest/`),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache",
              networkTimeoutSeconds: 8,
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
        ],
      },
      // -----------------------------------------
      // PWA Manifest
      // -----------------------------------------
      manifest: {
        name: "Hotel Guest App",
        short_name: "GuestApp",
        description: "Доступ до інформації про проживання в готелі",
        theme_color: "#383578",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        start_url: "/",
        icons: [
          {
            src: "pwa-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: "pwa-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
  // Шляхові скорочення
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  // Локальний сервер
  server: {
    port: 5174,
    host: true,
  },
  // Налаштування build
  build: {
    outDir: "dist",
    emptyOutDir: true,
  },
});

