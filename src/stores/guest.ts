// src/stores/guest.ts
// Pinia store для зберігання даних гостя

import { defineStore } from "pinia";
import { ref, type Ref } from "vue";
import type { GuestStayView } from "../types/guest";
import { getGuestAccessByToken } from "../api/guest";

export const useGuestStore = defineStore("guest", () => {
  // Дані про проживання
  const stayData: Ref<GuestStayView | null> = ref(null);

  // Стан завантаження
  const isLoading: Ref<boolean> = ref(false);

  // Помилка
  const error: Ref<string | null> = ref(null);

  /**
   * Завантажити дані про проживання по токену
   * @param token - токен доступу
   */
  async function loadStayData(token: string): Promise<void> {
    isLoading.value = true;
    error.value = null;

    try {
      stayData.value = await getGuestAccessByToken(token);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Невідома помилка";
      error.value = errorMessage;
      stayData.value = null;
    } finally {
      isLoading.value = false;
    }
  }

  /**
   * Очистити дані
   */
  function clearData(): void {
    stayData.value = null;
    error.value = null;
    isLoading.value = false;
  }

  return {
    stayData,
    isLoading,
    error,
    loadStayData,
    clearData,
  };
});

