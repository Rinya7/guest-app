// src/utils/online.ts
// Утиліта для відстеження online/offline статусу
// Використовує Navigator.onLine API + network events для надійності

import { ref, onMounted, onUnmounted } from "vue";

/**
 * Реактивний ref для статусу підключення
 */
export const isOnline = ref(navigator.onLine);

/**
 * Ініціалізувати відстеження online/offline статусу
 * Викликається в main.ts або App.vue
 */
export function initOnlineStatus(): void {
  const updateOnlineStatus = (): void => {
    isOnline.value = navigator.onLine;
  };

  window.addEventListener("online", updateOnlineStatus);
  window.addEventListener("offline", updateOnlineStatus);

  // Перевірка при завантаженні
  updateOnlineStatus();
}

