<template>
  <div class="guest-access">
    <h1>Завантаження...</h1>
    <p>Отримання інформації про проживання</p>
  </div>
</template>

<script setup lang="ts">
// src/views/GuestAccess.vue
// Сторінка доступу гостя по токену (заглушка)
import { useRoute } from "vue-router";

const route = useRoute();
const token = route.params.token as string;

// TODO: Завантажити дані з API
console.log("Token:", token);
</script>

<style scoped>
.guest-access {
  padding: 2rem;
  text-align: center;
}
</style>

