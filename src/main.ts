// src/main.ts
// Точка входу для Guest PWA додатку

import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import { createPinia } from "pinia";
import { i18n } from "./i18n";

// Імпортуємо базові стилі TailwindCSS
import "./styles/base.css";

// Ініціалізуємо відстеження online/offline статусу
import { initOnlineStatus } from "./utils/online";
initOnlineStatus();

// #region agent log
// Проверка регистрации Service Worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(registrations => {
    fetch('http://127.0.0.1:7242/ingest/8d66c63f-e2f9-456d-badb-5f6b79dd3854',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.ts:15',message:'Service Worker registrations check',data:{count:registrations.length,isOnline:navigator.onLine},timestamp:Date.now(),sessionId:'debug-session',runId:'offline-debug',hypothesisId:'D'})}).catch(()=>{});
  }).catch(err => {
    fetch('http://127.0.0.1:7242/ingest/8d66c63f-e2f9-456d-badb-5f6b79dd3854',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.ts:18',message:'Service Worker check error',data:{error:err.message},timestamp:Date.now(),sessionId:'debug-session',runId:'offline-debug',hypothesisId:'D'})}).catch(()=>{});
  });
} else {
  fetch('http://127.0.0.1:7242/ingest/8d66c63f-e2f9-456d-badb-5f6b79dd3854',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'main.ts:21',message:'Service Worker not supported',data:{},timestamp:Date.now(),sessionId:'debug-session',runId:'offline-debug',hypothesisId:'D'})}).catch(()=>{});
}
// #endregion

const app = createApp(App);

app.use(createPinia());
app.use(router);
app.use(i18n);

app.mount("#app");

