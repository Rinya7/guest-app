<!-- OfflinePage.vue -->
<!-- Fallback сторінка для offline режиму -->
<template>
  <GuestLayout>
    <div class="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
      <!-- Іконка offline -->
      <div class="w-24 h-24 mx-auto text-gray-400 dark:text-gray-500">
        <svg
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
      </div>

      <!-- Заголовок -->
      <h1 class="text-2xl font-semibold text-gray-900 dark:text-white">
        Немає підключення до інтернету
      </h1>

      <!-- Опис -->
      <p class="text-gray-600 dark:text-gray-400 max-w-md">
        Перевірте ваше з'єднання з інтернетом. Якщо ви раніше відкривали цю сторінку,
        деякі дані можуть бути доступні офлайн.
      </p>

      <!-- Кнопка повторної спроби -->
      <button
        @click="handleRetry"
        class="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
      >
        Спробувати знову
      </button>

      <!-- Інформація про кешовані дані -->
      <div
        v-if="hasCachedData"
        class="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg text-sm text-blue-800 dark:text-blue-200"
      >
        <p>ℹ️ Використовуються збережені дані</p>
      </div>
    </div>
  </GuestLayout>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useRouter } from "vue-router";
import { useGuestStore } from "../stores/guest";
import GuestLayout from "../layouts/GuestLayout.vue";

const router = useRouter();
const guestStore = useGuestStore();

const hasCachedData = computed(() => guestStore.stayData !== null);

function handleRetry(): void {
  const token = router.currentRoute.value.params.token as string | undefined;
  if (token) {
    guestStore.loadStayData(token);
  } else {
    // Перезавантажити сторінку
    window.location.reload();
  }
}
</script>

