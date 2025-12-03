<template>
  <!-- Компонент завантаження -->
  <div class="flex flex-col items-center justify-center min-h-[200px]">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
    <p class="mt-4 text-gray-600 dark:text-gray-400">{{ message }}</p>
  </div>
</template>

<script setup lang="ts">
// src/components/Loader.vue
// Компонент для відображення стану завантаження

withDefaults(defineProps<{
  message?: string;
}>(), {
  message: "Завантаження...",
});
</script>

