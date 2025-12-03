<template>
  <!-- Головна сторінка доступу - завантажує дані та перенаправляє залежно від статусу -->
  <GuestLayout>
    <!-- Стан завантаження -->
    <Loader v-if="guestStore.isLoading" message="Отримання інформації про проживання..." />

    <!-- Помилка -->
    <ErrorMessage
      v-else-if="guestStore.error"
      :message="guestStore.error"
      :show-retry="true"
      @retry="handleRetry"
    />

    <!-- Дані завантажені - перенаправляємо на відповідну сторінку -->
    <div v-else-if="guestStore.stayData" class="text-center">
      <Loader message="Перенаправлення..." />
    </div>
  </GuestLayout>
</template>

<script setup lang="ts">
// src/pages/AccessPage.vue
// Головна сторінка доступу гостя
// Логіка:
// 1. Отримує token з URL
// 2. Завантажує дані через guestStore.loadStayData(token)
// 3. Залежно від статусу (booked/occupied/completed/cancelled) перенаправляє на відповідну сторінку

import { onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useGuestStore } from "../stores/guest";
import GuestLayout from "../layouts/GuestLayout.vue";
import Loader from "../components/Loader.vue";
import ErrorMessage from "../components/ErrorMessage.vue";

const route = useRoute();
const router = useRouter();
const guestStore = useGuestStore();

// Отримуємо token з параметрів роуту (може бути undefined для кореневого роуту "/")
const token = (route.params.token as string | undefined) ?? null;

/**
 * Обробка повторної спроби завантаження
 */
function handleRetry(): void {
  if (token && token !== "undefined") {
    guestStore.loadStayData(token);
  }
}

/**
 * Перенаправлення залежно від статусу проживання
 */
function redirectByStatus(): void {
  const status = guestStore.stayData?.stayStatus;

  if (!status || !token || token === "undefined") {
    return;
  }

  switch (status) {
    case "booked":
    case "occupied":
      // Для booked та occupied показуємо повну інформацію
      router.replace(`/access/${token}/stay`);
      break;
    case "completed":
      router.replace(`/access/${token}/completed`);
      break;
    case "cancelled":
      router.replace(`/access/${token}/cancelled`);
      break;
    default:
      // Невідомий статус - залишаємося на поточній сторінці
      console.warn("Невідомий статус проживання:", status);
  }
}

// Спостерігаємо за змінами даних та перенаправляємо
watch(
  () => guestStore.stayData,
  () => {
    if (guestStore.stayData && !guestStore.isLoading && !guestStore.error) {
      redirectByStatus();
    }
  },
  { immediate: true }
);

// Завантажуємо дані при монтуванні компонента
onMounted(() => {
  if (token && token !== "undefined") {
    guestStore.loadStayData(token);
  } else {
    // Якщо токен не вказано (наприклад, на головній сторінці "/")
    // Показуємо повідомлення про необхідність токену
    guestStore.error = "Токен доступу не вказано. Будь ласка, використовуйте посилання з токеном.";
  }
});
</script>




