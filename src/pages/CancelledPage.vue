<template>
  <!-- Сторінка для скасованого бронювання -->
  <GuestLayout>
    <!-- Стан завантаження -->
    <Loader v-if="guestStore.isLoading" :message="t('loader.stayInfo')" />

    <!-- Помилка -->
    <ErrorMessage
      v-else-if="guestStore.error"
      :message="guestStore.error"
      :show-retry="true"
      @retry="handleRetry"
    />

    <!-- Дані не знайдено -->
    <div v-else-if="!guestStore.stayData" class="text-center">
      <p class="text-gray-600 dark:text-gray-400">{{ t("common.notFound") }}</p>
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
          {{ t("cancelled.title") }}
        </h2>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          {{ t("cancelled.message") }}
        </p>
      </div>

      <!-- Інформація про бронювання -->
      <InfoBlock :title="t('cancelled.bookingInfo')">
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("cancelled.hotel") }}</p>
            <p class="text-lg font-semibold">
              {{ guestStore.stayData.hotelName ?? t("common.notSpecified") }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("stay.roomNumber") }}</p>
            <p class="text-lg font-semibold">{{ guestStore.stayData.roomNumber }}</p>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("stay.checkIn") }}</p>
              <p class="text-lg font-semibold">{{ formatDate(guestStore.stayData.checkIn) }}</p>
            </div>
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("stay.checkOut") }}</p>
              <p class="text-lg font-semibold">{{ formatDate(guestStore.stayData.checkOut) }}</p>
            </div>
          </div>
        </div>
      </InfoBlock>

      <!-- Контакти для зв'язку -->
      <InfoBlock v-if="guestStore.stayData.contactPhone || guestStore.stayData.contactEmail" :title="t('contact.title')">
        <p class="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {{ t("contact.contactForCancellation") }}
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
import { useI18n } from "vue-i18n";
import { useGuestStore } from "../stores/guest";
import GuestLayout from "../layouts/GuestLayout.vue";
import InfoBlock from "../components/InfoBlock.vue";
import Loader from "../components/Loader.vue";
import ErrorMessage from "../components/ErrorMessage.vue";

const route = useRoute();
const guestStore = useGuestStore();
const { t, locale } = useI18n();

const token = route.params.token as string;

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
  if (token) {
    guestStore.loadStayData(token);
  }
}

/**
 * Форматування дати для відображення
 */
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  const localeMap: Record<string, string> = {
    uk: "uk-UA",
    en: "en-US",
    de: "de-DE",
    it: "it-IT",
  };
  return date.toLocaleDateString(localeMap[locale.value] || "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
</script>

