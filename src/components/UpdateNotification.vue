<!-- UpdateNotification.vue -->
<!-- Компонент для сповіщення про доступність оновлення PWA -->
<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 translate-y-2"
  >
    <div
      v-if="updateAvailable"
      class="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-4"
    >
      <div class="flex items-start gap-3">
        <div class="flex-shrink-0">
          <svg
            class="w-5 h-5 text-blue-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
            />
          </svg>
        </div>
        <div class="flex-1 min-w-0">
          <p class="text-sm font-medium text-gray-900 dark:text-white">
            Доступне оновлення
          </p>
          <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Нова версія додатку готова. Перезавантажте для застосування.
          </p>
        </div>
        <div class="flex gap-2">
          <button
            @click="handleReload"
            class="px-3 py-1.5 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Оновити
          </button>
          <button
            @click="handleDismiss"
            class="px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            Пізніше
          </button>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { useServiceWorkerUpdate } from "../composables/useServiceWorkerUpdate";

const { updateAvailable, reloadPage } = useServiceWorkerUpdate();

function handleReload(): void {
  reloadPage();
}

function handleDismiss(): void {
  // Можна зберігати в localStorage, щоб не показувати знову
  // Поки що просто приховуємо
  updateAvailable.value = false;
}
</script>

