<template>
  <!-- Сторінка для завершеного проживання -->
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
      <!-- Подяка -->
      <div class="card text-center">
        <div class="mb-4">
          <svg
            class="mx-auto h-16 w-16 text-green-600 dark:text-green-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h2 class="text-3xl font-bold mb-4">{{ t("completed.title") }}</h2>
        <p class="text-lg text-gray-600 dark:text-gray-400">
          {{ t("completed.message") }}
        </p>
      </div>

      <!-- Інформація про проживання (read-only) -->
      <InfoBlock :title="t('completed.stayInfo')">
        <div class="space-y-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ t("completed.hotel") }}</p>
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

      <!-- Контакти (якщо потрібно зв'язатися) -->
      <InfoBlock v-if="guestStore.stayData.contactPhone || guestStore.stayData.contactEmail" :title="t('contact.title')">
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
// src/pages/CompletedPage.vue
// Сторінка для завершеного проживання (read-only)
// Показує подяку та історію проживання

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

