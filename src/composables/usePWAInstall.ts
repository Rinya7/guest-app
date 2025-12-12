// src/composables/usePWAInstall.ts
// Composable для обробки установки PWA
// Підтримує beforeinstallprompt event для контролю установки

import { ref, onMounted, onUnmounted } from "vue";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const deferredPrompt = ref<BeforeInstallPromptEvent | null>(null);
const isInstallable = ref(false);
const isInstalled = ref(false);

/**
 * Composable для роботи з PWA установкою
 */
export function usePWAInstall() {
  /**
   * Показати промпт установки (якщо доступний)
   */
  async function promptInstall(): Promise<boolean> {
    if (!deferredPrompt.value) {
      return false;
    }

    try {
      await deferredPrompt.value.prompt();
      const choiceResult = await deferredPrompt.value.userChoice;
      deferredPrompt.value = null;
      isInstallable.value = false;
      return choiceResult.outcome === "accepted";
    } catch (error) {
      console.error("[PWA Install] Failed to show prompt:", error);
      return false;
    }
  }

  /**
   * Перевірити, чи встановлено додаток
   */
  function checkIfInstalled(): boolean {
    // Перевірка для standalone режиму (встановлено)
    if (window.matchMedia("(display-mode: standalone)").matches) {
      return true;
    }
    // Перевірка для iOS Safari
    if ((window.navigator as { standalone?: boolean }).standalone === true) {
      return true;
    }
    return false;
  }

  onMounted(() => {
    // Перевіряємо, чи вже встановлено
    isInstalled.value = checkIfInstalled();

    // Обробка beforeinstallprompt (Android Chrome)
    const handleBeforeInstallPrompt = (e: Event): void => {
      e.preventDefault();
      deferredPrompt.value = e as BeforeInstallPromptEvent;
      isInstallable.value = true;
    };

    // Обробка appinstalled (після установки)
    const handleAppInstalled = (): void => {
      deferredPrompt.value = null;
      isInstallable.value = false;
      isInstalled.value = true;
    };

    window.addEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
    window.addEventListener("appinstalled", handleAppInstalled);

    onUnmounted(() => {
      window.removeEventListener("beforeinstallprompt", handleBeforeInstallPrompt);
      window.removeEventListener("appinstalled", handleAppInstalled);
    });
  });

  return {
    isInstallable,
    isInstalled,
    promptInstall,
  };
}

