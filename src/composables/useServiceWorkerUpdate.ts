// src/composables/useServiceWorkerUpdate.ts
// Composable для обробки оновлень Service Worker
// Показує сповіщення про доступність нової версії

import { ref, onMounted } from "vue";

const updateAvailable = ref(false);
const registration = ref<ServiceWorkerRegistration | null>(null);

/**
 * Composable для роботи з оновленнями Service Worker
 */
export function useServiceWorkerUpdate() {
  /**
   * Перезавантажити сторінку для застосування оновлення
   */
  function reloadPage(): void {
    window.location.reload();
  }

  /**
   * Перевірити наявність оновлення Service Worker
   */
  async function checkForUpdate(): Promise<void> {
    if (!registration.value) {
      return;
    }

    try {
      await registration.value.update();
    } catch (error) {
      console.error("[SW Update] Failed to check for update:", error);
    }
  }

  onMounted(() => {
    // Перевіряємо, чи підтримується Service Worker
    if (!("serviceWorker" in navigator)) {
      return;
    }

    // Очікуємо на готовність Service Worker
    navigator.serviceWorker.ready.then((reg) => {
      registration.value = reg;

      // Слухаємо подію оновлення
      reg.addEventListener("updatefound", () => {
        const newWorker = reg.installing;
        if (!newWorker) {
          return;
        }

        newWorker.addEventListener("statechange", () => {
          if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
            // Новий Service Worker встановлено, але старий ще активний
            updateAvailable.value = true;
          }
        });
      });
    });

    // Слухаємо подію контролера (коли новий SW стає активним)
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      // Автоматично перезавантажуємо при зміні контролера
      reloadPage();
    });
  });

  return {
    updateAvailable,
    reloadPage,
    checkForUpdate,
  };
}

