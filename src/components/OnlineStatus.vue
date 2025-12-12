<!-- OnlineStatus.vue -->
<!-- Компонент для відображення статусу online/offline -->
<template>
  <Transition
    enter-active-class="transition-all duration-300 ease-out"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-300 ease-in"
    leave-from-class="opacity-100 translate-y-0"
    leave-to-class="opacity-0 -translate-y-2"
  >
    <div
      v-if="showStatus"
      :class="{
        'bg-red-500 dark:bg-red-600': !isOnline,
        'bg-green-500 dark:bg-green-600': isOnline && wasOffline,
      }"
      class="fixed top-0 left-0 right-0 z-50 px-4 py-2 text-center text-white text-sm font-medium shadow-md"
    >
      <div class="flex items-center justify-center gap-2">
        <svg
          v-if="!isOnline"
          class="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
          />
        </svg>
        <svg
          v-else
          class="w-4 h-4"
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
        <span>
          {{ !isOnline ? "Немає підключення" : "Підключення відновлено" }}
        </span>
      </div>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch, onMounted } from "vue";
import { isOnline } from "../utils/online";

const wasOffline = ref(false);
const showStatus = ref(false);

watch(
  () => isOnline.value,
  (newValue, oldValue) => {
    if (!oldValue && newValue) {
      // Тільки що відновилися
      wasOffline.value = true;
      showStatus.value = true;
      setTimeout(() => {
        wasOffline.value = false;
        setTimeout(() => {
          showStatus.value = false;
        }, 2000);
      }, 2000);
    } else if (!newValue) {
      // Стали offline
      wasOffline.value = false;
      showStatus.value = true;
    }
  },
  { immediate: true }
);

onMounted(() => {
  // Показуємо статус при завантаженні, якщо offline
  if (!isOnline.value) {
    showStatus.value = true;
  }
});
</script>

