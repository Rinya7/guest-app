// src/main.ts
// Точка входу для Guest PWA додатку

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

// Імпортуємо базові стилі TailwindCSS
import "./styles/base.css";

// Ініціалізуємо відстеження online/offline статусу
import { initOnlineStatus } from "./utils/online";
initOnlineStatus();

// Очищення застарілих даних при старті (не блокує завантаження)
import { cleanupOldData } from "./utils/storage";
cleanupOldData().catch(() => {
  // Ігноруємо помилки очищення
});

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

