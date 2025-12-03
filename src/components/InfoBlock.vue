<template>
  <!-- Універсальний інформаційний блок -->
  <div class="card">
    <div v-if="title" class="mb-4">
      <h3 class="text-xl font-semibold">{{ title }}</h3>
    </div>
    <div class="space-y-3">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
// src/components/InfoBlock.vue
// Універсальний компонент для відображення інформаційних блоків
// Використовується для структурування контенту на сторінках

defineProps<{
  title?: string;
}>();
</script>




