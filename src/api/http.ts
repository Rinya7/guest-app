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

// Логируем используемый API URL (важно для диагностики)
console.log("[HTTP Client] API URL:", API_URL);
console.log("[HTTP Client] Environment:", import.meta.env.MODE);
console.log("[HTTP Client] VITE_API_URL from env:", import.meta.env.VITE_API_URL);

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
    return response;
  },
  (error: AxiosError) => {
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
      // Помилка мережі (немає відповіді від сервера)
      const networkError = error.code === "ERR_NETWORK" || 
                          error.message?.includes("Network Error") ||
                          error.message?.includes("ERR_INTERNET_DISCONNECTED");
      
      if (networkError) {
        console.error("Помилка мережі:", error.message || "Немає відповіді від сервера");
        // Викидаємо помилку з більш зрозумілим повідомленням
        return Promise.reject(new Error("Помилка мережі. Перевірте підключення до інтернету."));
      }
      
      console.error("Немає відповіді від сервера");
    } else {
      console.error("Помилка запиту:", error.message);
    }

    return Promise.reject(error);
  }
);

export default http;

