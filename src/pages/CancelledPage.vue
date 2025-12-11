<template>
  <!-- Сторінка для скасованого бронювання -->
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

    <!-- Дані не знайдено -->
    <div v-else-if="!guestStore.stayData" class="text-center">
      <p class="text-gray-600 dark:text-gray-400">Дані не знайдено</p>
    </div>

    <!-- Контент -->
    <div v-else class="space-y-6">
      <!-- Повідомлення про скасування -->
      <div class="card text-center">
        <div class="mb-4">
          <svg
            class="mx-auto h-16 w-16 text-red-600 dark:text-red-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 class="text-3xl font-bold mb-4 text-red-600 dark:text-red-400">
          Бронювання скасовано
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          Ваше бронювання було скасовано.
        </p>
      </div>

      <!-- Інформація про бронювання -->
      <InfoBlock title="Інформація про бронювання">
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Готель</p>
            <p class="text-lg font-semibold">
              {{ guestStore.stayData.hotelName ?? "Не вказано" }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">Номер кімнати</p>
            <p class="text-lg font-semibold">{{ guestStore.stayData.roomNumber }}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Заїзд</p>
              <p class="text-lg font-semibold">{{ formatDate(guestStore.stayData.checkIn) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Виїзд</p>
              <p class="text-lg font-semibold">{{ formatDate(guestStore.stayData.checkOut) }}</p>
            </div>
          </div>
        </div>
      </InfoBlock>

      <!-- Контакти для зв'язку -->
      <InfoBlock v-if="guestStore.stayData.contactPhone || guestStore.stayData.contactEmail" title="Контакти">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          Якщо у вас є питання щодо скасування, будь ласка, зв'яжіться з нами:
        </p>
        <div class="space-y-2">
          <a
            v-if="guestStore.stayData.contactPhone"
            :href="`tel:${guestStore.stayData.contactPhone}`"
            class="block text-blue-600 dark:text-blue-400 hover:underline"
          >
            {{ guestStore.stayData.contactPhone }}
          </a>
          <a
            v-if="guestStore.stayData.contactEmail"
            :href="`mailto:${guestStore.stayData.contactEmail}`"
            class="block text-blue-600 dark:text-blue-400 hover:underline"
          >
            {{ guestStore.stayData.contactEmail }}
          </a>
        </div>
      </InfoBlock>
    </div>
  </GuestLayout>
</template>

<script setup lang="ts">
// src/pages/CancelledPage.vue
// Сторінка для скасованого бронювання
// Показує інформацію про скасування та контакти для зв'язку

import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGuestStore } from "../stores/guest";
import GuestLayout from "../layouts/GuestLayout.vue";
import InfoBlock from "../components/InfoBlock.vue";
import Loader from "../components/Loader.vue";
import ErrorMessage from "../components/ErrorMessage.vue";

const route = useRoute();
const guestStore = useGuestStore();

// Отримуємо token з параметрів роуту з перевіркою
const token = (route.params.token as string | undefined) ?? null;

// Завантажуємо дані, якщо їх немає (наприклад, після перезавантаження сторінки)
onMounted(async () => {
  if (!guestStore.stayData && token) {
    await guestStore.loadStayData(token);
  }
});

/**
 * Обробка повторної спроби завантаження
 */
function handleRetry(): void {
  if (token && token.trim() !== "") {
    guestStore.loadStayData(token);
  }
}

/**
 * Форматування дати для відображення
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  // Перевіряємо валідність дати
  if (isNaN(date.getTime())) {
    return dateString; // Повертаємо оригінальний рядок, якщо дата невалідна
  }
  return date.toLocaleDateString("uk-UA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
</script>

