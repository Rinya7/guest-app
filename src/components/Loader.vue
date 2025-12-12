<template>
  <!-- Компонент завантаження -->
  <div class="flex flex-col items-center justify-center min-h-[200px]">
    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 dark:border-blue-400"></div>
    <p class="mt-4 text-gray-600 dark:text-gray-400">{{ displayMessage }}</p>
  </div>
</template>

<script setup lang="ts">
// src/components/Loader.vue
// Компонент для відображення стану завантаження

import { computed } from "vue";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const props = withDefaults(defineProps<{
  message?: string;
}>(), {
  message: undefined,
});

const displayMessage = computed(() => {
  return props.message ?? t("loader.default");
});
</script>

