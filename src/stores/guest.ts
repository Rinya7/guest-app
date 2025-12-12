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
    // #region agent log
    const isOffline = !navigator.onLine;
    fetch('http://127.0.0.1:7242/ingest/8d66c63f-e2f9-456d-badb-5f6b79dd3854',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guest.ts:23',message:'loadStayData called',data:{token:token.substring(0,10)+'...',isOffline,navigatorOnline:navigator.onLine},timestamp:Date.now(),sessionId:'debug-session',runId:'offline-debug',hypothesisId:'C'})}).catch(()=>{});
    // #endregion
    
    isLoading.value = true;
    error.value = null;

    try {
      stayData.value = await getGuestAccessByToken(token);
      // #region agent log
      fetch('http://127.0.0.1:7242/ingest/8d66c63f-e2f9-456d-badb-5f6b79dd3854',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guest.ts:28',message:'loadStayData success',data:{hasStayData:!!stayData.value},timestamp:Date.now(),sessionId:'debug-session',runId:'offline-debug',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
    } catch (err) {
      // #region agent log
      const errorMessage = err instanceof Error ? err.message : "Невідома помилка";
      const isNetworkError = err instanceof Error && (err.message.includes('ERR_INTERNET_DISCONNECTED') || err.message.includes('Network Error') || !navigator.onLine);
      fetch('http://127.0.0.1:7242/ingest/8d66c63f-e2f9-456d-badb-5f6b79dd3854',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({location:'guest.ts:30',message:'loadStayData error',data:{errorMessage,isNetworkError,isOffline:!navigator.onLine},timestamp:Date.now(),sessionId:'debug-session',runId:'offline-debug',hypothesisId:'C'})}).catch(()=>{});
      // #endregion
      
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

