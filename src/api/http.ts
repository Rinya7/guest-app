// src/api/http.ts
// HTTP клієнт для взаємодії з backend API

import axios, {
  type AxiosInstance,
  type AxiosError,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from "axios";

// Получаем API URL из переменных окружения
// В development: используется .env
// В production build: используется .env.production
const API_URL: string = import.meta.env.VITE_API_URL ?? "http://localhost:3000";

// Логируем используемый API URL только в development режиме
if (import.meta.env.DEV) {
  console.log("[HTTP Client] API URL:", API_URL);
  console.log("[HTTP Client] Environment:", import.meta.env.MODE);
}

// Створюємо інстанс Axios з базовою конфігурацією
const http: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor (якщо потрібно додати заголовки)
http.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // Тут можна додати логіку перед відправкою запиту
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor (обробка помилок)
http.interceptors.response.use(
  (response: AxiosResponse) => {
    // #region agent log
    fetch('http://127.0.0.1:7242/ingest/8d66c63f-e2f9-456d-badb-5f6b79dd3854',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'http.ts:44',message:'HTTP response success',data:{url:response.config.url,status:response.status},timestamp:Date.now(),sessionId:'debug-session',runId:'offline-debug',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    return response;
  },
  (error: AxiosError) => {
    // #region agent log
    const isOffline = !navigator.onLine;
    const errorType = error.response ? 'response' : error.request ? 'request' : 'other';
    const errorCode = error.code;
    fetch('http://127.0.0.1:7242/ingest/8d66c63f-e2f9-456d-badb-5f6b79dd3854',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'http.ts:47',message:'HTTP error',data:{url:error.config?.url,errorType,errorCode,isOffline,navigatorOnline:navigator.onLine},timestamp:Date.now(),sessionId:'debug-session',runId:'offline-debug',hypothesisId:'A'})}).catch(()=>{});
    // #endregion
    
    // Обробка помилок (401, 403, 404, 500, тощо)
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as { message?: string })?.message ?? "Помилка сервера";

      switch (status) {
        case 400:
          console.error("Невірний запит:", message);
          break;
        case 404:
          console.error("Ресурс не знайдено:", message);
          break;
        case 410:
          console.error("Доступ відкликано або прострочено:", message);
          break;
        case 500:
          console.error("Помилка сервера:", message);
          break;
        default:
          console.error("Помилка:", message);
      }
    } else if (error.request) {
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8d66c63f-e2f9-456d-badb-5f6b79dd3854',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'http.ts:69',message:'No response from server',data:{isOffline,errorMessage:error.message},timestamp:Date.now(),sessionId:'debug-session',runId:'offline-debug',hypothesisId:'B'})}).catch(()=>{});
      // #endregion
      console.error("Немає відповіді від сервера");
    } else {
      console.error("Помилка запиту:", error.message);
    }

    return Promise.reject(error);
  }
);

export default http;

