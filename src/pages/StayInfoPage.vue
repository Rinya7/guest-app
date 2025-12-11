<template>
  <!-- Сторінка з інформацією про проживання -->
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
      <!-- Інформація про проживання (объединенный блок) -->
      <InfoBlock title="Інформація про проживання">
        <div class="space-y-6">
          <!-- Основна інформація: комната и статус -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Номер кімнати</p>
              <p class="text-lg font-semibold">{{ guestStore.stayData.roomNumber }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">Статус</p>
              <p class="text-lg font-semibold">
                <span
                  :class="{
                    'text-blue-600 dark:text-blue-400': guestStore.stayData.stayStatus === 'booked',
                    'text-green-600 dark:text-green-400': guestStore.stayData.stayStatus === 'occupied',
                  }"
                >
                  {{ getStatusLabel(guestStore.stayData.stayStatus) }}
                </span>
              </p>
            </div>
          </div>

          <!-- Дати проживання -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Заїзд</p>
                <p class="text-lg font-semibold">{{ formatDate(guestStore.stayData.checkIn) }}</p>
                <p v-if="guestStore.stayData.policyCheckInHour !== null" class="text-sm text-gray-600 dark:text-gray-400">
                  Після {{ guestStore.stayData.policyCheckInHour }}:00
                </p>
              </div>
              <div>
                <p class="text-sm text-gray-500 dark:text-gray-400">Виїзд</p>
                <p class="text-lg font-semibold">{{ formatDate(guestStore.stayData.checkOut) }}</p>
                <p v-if="guestStore.stayData.policyCheckOutHour !== null" class="text-sm text-gray-600 dark:text-gray-400">
                  До {{ guestStore.stayData.policyCheckOutHour }}:00
                </p>
              </div>
            </div>
          </div>

          <!-- Дані гостя -->
          <div class="border-t border-gray-200 dark:border-gray-700 pt-4">
            <div class="space-y-4">
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div v-if="guestStore.stayData.firstName">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Ім'я</p>
                  <p class="text-lg font-semibold">{{ guestStore.stayData.firstName }}</p>
                </div>
                <div v-if="guestStore.stayData.lastName">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Прізвище</p>
                  <p class="text-lg font-semibold">{{ guestStore.stayData.lastName }}</p>
                </div>
                <div v-if="guestStore.stayData.email">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Email</p>
                  <p class="text-lg font-semibold">{{ guestStore.stayData.email }}</p>
                </div>
                <div v-if="guestStore.stayData.phoneCountryCode || guestStore.stayData.phoneNumber">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Телефон</p>
                  <p class="text-lg font-semibold">
                    <span v-if="guestStore.stayData.phoneCountryCode">{{ guestStore.stayData.phoneCountryCode }} </span>
                    <span v-if="guestStore.stayData.phoneNumber">{{ guestStore.stayData.phoneNumber }}</span>
                  </p>
                </div>
                <div v-if="guestStore.stayData.guestsCount != null">
                  <p class="text-sm text-gray-500 dark:text-gray-400">Кількість гостей</p>
                  <p class="text-lg font-semibold">{{ guestStore.stayData.guestsCount }}</p>
                </div>
              </div>
              <div v-if="guestStore.stayData.mainGuestName">
                <p class="text-sm text-gray-500 dark:text-gray-400">Основний гість</p>
                <p class="text-lg font-semibold">{{ guestStore.stayData.mainGuestName }}</p>
              </div>
              <div v-if="guestStore.stayData.extraGuestNames.length > 0" class="mt-2">
                <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Додаткові гості:</p>
                <ul class="list-disc list-inside space-y-1">
                  <li
                    v-for="(name, index) in guestStore.stayData.extraGuestNames"
                    :key="index"
                    class="text-gray-700 dark:text-gray-300"
                  >
                    {{ name }}
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </InfoBlock>

      <!-- Навігація -->
      <div v-if="token" class="flex flex-wrap gap-4">
        <router-link
          :to="`/access/${token}/wifi`"
          class="btn btn-primary"
        >
          Wi-Fi інформація
        </router-link>
        <router-link
          :to="`/access/${token}/contact`"
          class="btn btn-secondary"
        >
          Контакти готелю
        </router-link>
      </div>
    </div>
  </GuestLayout>
</template>

<script setup lang="ts">
// src/pages/StayInfoPage.vue
// Сторінка з детальною інформацією про проживання
// Показує: номер кімнати, дати, гостей, політику заїзду/виїзду
// Доступна для статусів: booked, occupied

import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGuestStore } from "../stores/guest";
import GuestLayout from "../layouts/GuestLayout.vue";
import InfoBlock from "../components/InfoBlock.vue";
import Loader from "../components/Loader.vue";
import ErrorMessage from "../components/ErrorMessage.vue";
import type { GuestStayStatus } from "../types/guest";

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

/**
 * Обробка повторної спроби завантаження
 */
function handleRetry(): void {
  if (token && token.trim() !== "") {
    guestStore.loadStayData(token);
  }
}

/**
 * Отримати текстовий лейбл для статусу
 */
function getStatusLabel(status: GuestStayStatus): string {
  const labels: Record<GuestStayStatus, string> = {
    booked: "Бронювання підтверджено",
    occupied: "Гість заселений",
    completed: "Проживання завершено",
    cancelled: "Бронювання скасовано",
  };
  return labels[status] ?? status;
}
</script>

