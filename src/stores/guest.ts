// src/stores/guest.ts
// Pinia store для зберігання даних гостя з offline-first стратегією

import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import type { GuestStayView } from "../types/guest";
import { getGuestAccessByToken } from "../api/guest";
import { saveStayData, getStayData, deleteStayData } from "../utils/storage";
import { isOnline } from "../utils/online";

export const useGuestStore = defineStore("guest", () => {
  // Дані про проживання
  const stayData: Ref<GuestStayView | null> = ref(null);

  // Стан завантаження
  const isLoading: Ref<boolean> = ref(false);

  // Помилка
  const error: Ref<string | null> = ref(null);

  // Чи дані завантажені з кешу (offline)
  const isFromCache: Ref<boolean> = ref(false);

  /**
   * Завантажити дані про проживання по токену (offline-first стратегія)
   * @param token - токен доступу
   */
  async function loadStayData(token: string): Promise<void> {
    isLoading.value = true;
    error.value = null;
    isFromCache.value = false;

    // 1. Спочатку намагаємося завантажити з кешу (швидко)
    try {
      const cachedData = await getStayData(token);
      if (cachedData) {
        stayData.value = cachedData as GuestStayView;
        isFromCache.value = true;
        // Не встановлюємо isLoading = false тут - продовжуємо спробу оновити з мережі
      }
    } catch (err) {
      console.warn("[GuestStore] Failed to load from cache:", err);
    }

    // 2. Якщо онлайн - намагаємося оновити з API
    if (isOnline.value) {
      try {
        const freshData = await getGuestAccessByToken(token);
        stayData.value = freshData;
        isFromCache.value = false;

        // Зберігаємо успішні дані в кеш
        await saveStayData(token, freshData);
      } catch (err) {
        // Якщо помилка API і немає кешованих даних - показуємо помилку
        if (!stayData.value) {
          const errorMessage =
            err instanceof Error ? err.message : "Невідома помилка";
          error.value = errorMessage;
          stayData.value = null;
        }
        // Якщо є кешовані дані - використовуємо їх (вже встановлено вище)
      }
    } else {
      // Offline: якщо немає кешованих даних - помилка
      if (!stayData.value) {
        error.value = "Немає підключення до інтернету. Будь ласка, перевірте з'єднання.";
      }
    }

    isLoading.value = false;
  }

  /**
   * Очистити дані
   */
  function clearData(): void {
    stayData.value = null;
    error.value = null;
    isLoading.value = false;
    isFromCache.value = false;
  }

  /**
   * Очистити кешовані дані для токена
   */
  async function clearCachedData(token: string): Promise<void> {
    await deleteStayData(token);
    if (stayData.value) {
      clearData();
    }
  }

  return {
    stayData,
    isLoading,
    error,
    isFromCache,
    loadStayData,
    clearData,
    clearCachedData,
  };
});

