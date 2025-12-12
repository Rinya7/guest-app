import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { VitePWA } from "vite-plugin-pwa";
import path from "path";

// Це важливо → щоб PWA працювала і локально, і в продакшені
// В vite.config.ts можна використовувати process.env, бо це Node.js середовище
// Використовуємо VITE_API_URL для консистентності з кодом (src/api/http.ts)
const API_BASE = process.env.VITE_API_URL || "http://localhost:3000";

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
        // Версіонування кешу для коректних оновлень
        cacheId: "hotel-guest-pwa-v1",
        // Кешує всі js/css/html/svg/png
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        // Стратегія кешування статики: CacheFirst для швидкості
        runtimeCaching: [
          // -----------------------------
          // Кеш картинок (оптимально)
          // -----------------------------
          {
            urlPattern: /^https:\/\/.*\.(png|jpg|jpeg|svg|gif|webp)$/i,
            handler: "CacheFirst",
            options: {
              cacheName: "images-cache-v1",
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 днів
              },
            },
          },
          // -----------------------------
          // Кеш API бекенду Guest (NetworkFirst з fallback на кеш)
          // -----------------------------
          {
            // ВАЖЛИВО: ловимо запити саме на твій бекенд
            urlPattern: new RegExp(`${API_BASE.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}/guest/`),
            handler: "NetworkFirst",
            options: {
              cacheName: "api-cache-v1",
              networkTimeoutSeconds: 8,
              cacheableResponse: {
                statuses: [0, 200],
              },
              // Fallback на кеш при помилці мережі
              fallbackToNetwork: false,
            },
          },
        ],
        // Обробка помилок Service Worker
        skipWaiting: true,
        clientsClaim: true,
        // Очищення старих кешів при оновленні
        cleanupOutdatedCaches: true,
      },
      // Обробка оновлень Service Worker
      devOptions: {
        enabled: false, // Відключено в dev для стабільності
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
        scope: "/",
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
        // iOS specific
        apple_touch_icon: "apple-touch-icon.png",
        // Категория для app stores (опционально)
        categories: ["travel", "hospitality"],
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
    // ⚠️ ВАЖЛИВО для production:
    // - Використовується .env.production для змінних середовища
    // - Команда: npm run build -- --mode production
    // - VITE_API_URL з .env.production вбудовується в код під час збірки
    // - Результат: статичні файли в папці dist/ (HTML, CSS, JS)
    // - Ці файли потім копіюються в nginx контейнер для деплою
  },
});

