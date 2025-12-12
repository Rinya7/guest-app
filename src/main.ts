// src/main.ts
// Точка входу для Guest PWA додатку

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";

// Імпортуємо базові стилі TailwindCSS
import "./styles/base.css";

// Обробка помилок Service Worker
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("error", (event) => {
    console.error("[Service Worker] Помилка:", event.error || event.message);
    // Не блокуємо роботу додатку при помилках Service Worker
  });

  navigator.serviceWorker.ready.catch((error) => {
    console.warn("[Service Worker] Не вдалося зареєструвати Service Worker:", error);
    // Продовжуємо роботу без Service Worker
  });
}

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");

