<template>
  <!-- Компонент для відображення помилок -->
  <div class="card max-w-md mx-auto mt-8">
    <div class="flex items-center gap-3">
      <div class="flex-shrink-0">
        <svg
          class="h-6 w-6 text-red-600 dark:text-red-400"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      </div>
      <div class="flex-1">
        <h3 class="text-lg font-semibold text-red-600 dark:text-red-400">
          {{ t("common.error") }}
        </h3>
        <p class="mt-1 text-sm text-gray-600 dark:text-gray-400">
          {{ message }}
        </p>
      </div>
    </div>
    <div v-if="showRetry" class="mt-4">
      <button
        @click="$emit('retry')"
        class="btn btn-primary w-full"
      >
        {{ t("common.retry") }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
// src/components/ErrorMessage.vue
// Компонент для відображення помилок з можливістю повторної спроби

import { useI18n } from "vue-i18n";

const { t } = useI18n();

defineEmits<{
  retry: [];
}>();

withDefaults(defineProps<{
  message: string;
  showRetry?: boolean;
}>(), {
  showRetry: false,
});
</script>

