<template>
  <!-- Основний layout для гостьового додатку -->
  <div class="min-h-screen flex flex-col">
    <!-- Header з назвою готелю -->
    <header
      v-if="hotelName"
      class="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700"
    >
      <div class="container mx-auto px-4 py-4">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">
          {{ hotelName }}
        </h1>
      </div>
    </header>

    <!-- Основний контент -->
    <main class="flex-1 container mx-auto px-4 py-8">
      <!-- Індикатор кешованих даних (offline mode) -->
      <div
        v-if="guestStore.isFromCache"
        class="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm text-blue-800 dark:text-blue-200"
      >
        <div class="flex items-center gap-2">
          <svg
            class="w-4 h-4 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M5 13l4 4L19 7"
            />
          </svg>
          <span>Використовуються збережені дані. Деяка інформація може бути застарілою.</span>
        </div>
      </div>
      <slot />
    </main>

    <!-- Footer (опціонально) -->
    <footer class="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 mt-auto">
      <div class="container mx-auto px-4 py-4 text-center text-sm text-gray-600 dark:text-gray-400">
        <p>Hotel Guest App &copy; {{ currentYear }}</p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// src/layouts/GuestLayout.vue
// Основний layout для всіх сторінок гостьового додатку
// Включає header з назвою готелю (якщо доступна) та footer

import { computed } from "vue";
import { useGuestStore } from "../stores/guest";

const guestStore = useGuestStore();

// Отримуємо назву готелю зі store
const hotelName = computed(() => guestStore.stayData?.hotelName ?? null);

// Поточний рік для footer
const currentYear = computed(() => new Date().getFullYear());
</script>




