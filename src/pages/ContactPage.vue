<template>
  <!-- Сторінка з контактами готелю -->
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
      <!-- Контакти отеля (объединенный блок) -->
      <InfoBlock 
        v-if="hasContactInfo"
        title="Контакти отеля"
      >
        <div class="space-y-4">
          <!-- Назва готелю -->
          <div v-if="guestStore.stayData.hotelName">
            <p class="text-sm text-gray-500 dark:text-gray-400">Назва</p>
            <p class="text-lg font-semibold">{{ guestStore.stayData.hotelName }}</p>
          </div>

          <!-- Адреса -->
          <div v-if="guestStore.stayData.hotelAddress">
            <p class="text-sm text-gray-500 dark:text-gray-400">Адреса</p>
            <p class="text-lg font-semibold">{{ guestStore.stayData.hotelAddress }}</p>
          </div>

          <!-- Карта -->
          <div v-if="guestStore.stayData.hotelLatitude && guestStore.stayData.hotelLongitude">
            <a
              :href="`https://www.google.com/maps?q=${guestStore.stayData.hotelLatitude},${guestStore.stayData.hotelLongitude}`"
              target="_blank"
              rel="noopener noreferrer"
              class="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
            >
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
              </svg>
              <span>Відкрити на карті</span>
            </a>
          </div>

          <!-- Телефон -->
          <div v-if="guestStore.stayData.contactPhone">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Телефон</p>
            <a
              :href="`tel:${guestStore.stayData.contactPhone}`"
              class="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {{ guestStore.stayData.contactPhone }}
            </a>
          </div>

          <!-- Email -->
          <div v-if="guestStore.stayData.contactEmail">
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Email</p>
            <a
              :href="`mailto:${guestStore.stayData.contactEmail}`"
              class="text-lg font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              {{ guestStore.stayData.contactEmail }}
            </a>
          </div>

          <!-- Якщо немає інформації -->
          <div v-if="!guestStore.stayData.hotelName && !guestStore.stayData.hotelAddress && !guestStore.stayData.contactPhone && !guestStore.stayData.contactEmail && (!guestStore.stayData.hotelLatitude || !guestStore.stayData.hotelLongitude)">
            <p class="text-gray-600 dark:text-gray-400">
              Контактна інформація не надана
            </p>
          </div>
        </div>
      </InfoBlock>

      <!-- Навігація назад -->
      <div v-if="token">
        <router-link
          :to="`/access/${token}/stay`"
          class="btn btn-secondary"
        >
          ← Назад до інформації про проживання
        </router-link>
      </div>
    </div>
  </GuestLayout>
</template>

<script setup lang="ts">
// src/pages/ContactPage.vue
// Сторінка з контактною інформацією готелю
// Показує: адресу, телефон, email (якщо доступні)

import { computed, onMounted } from "vue";
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

// Computed для перевірки наявності контактної інформації
const hasContactInfo = computed(() => {
  const data = guestStore.stayData;
  if (!data) return false;
  return !!(
    data.hotelName ||
    data.hotelAddress ||
    data.contactPhone ||
    data.contactEmail ||
    (data.hotelLatitude && data.hotelLongitude)
  );
});

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
</script>

