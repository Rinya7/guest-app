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
      <!-- Основна інформація -->
      <InfoBlock title="Інформація про проживання">
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
      </InfoBlock>

      <!-- Дати -->
      <InfoBlock title="Дати проживання">
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
      </InfoBlock>

      <!-- Гості -->
      <InfoBlock title="Гості">
        <div>
          <p class="text-lg font-semibold">{{ guestStore.stayData.mainGuestName }}</p>
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
      </InfoBlock>

      <!-- Навігація -->
      <div class="flex flex-wrap gap-4">
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

const token = route.params.token as string;

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
  if (token) {
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

