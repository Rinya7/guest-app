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
      <!-- Адреса готелю -->
      <InfoBlock v-if="guestStore.stayData.hotelAddress" title="Адреса готелю">
        <p class="text-lg">{{ guestStore.stayData.hotelAddress }}</p>
      </InfoBlock>

      <!-- Контакти -->
      <InfoBlock title="Контакти">
        <div class="space-y-4">
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

          <!-- Якщо контактів немає -->
          <div v-if="!guestStore.stayData.contactPhone && !guestStore.stayData.contactEmail">
            <p class="text-gray-600 dark:text-gray-400">
              Контактна інформація не надана
            </p>
          </div>
        </div>
      </InfoBlock>

      <!-- Навігація назад -->
      <div>
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

import { onMounted } from "vue";
import { useRoute } from "vue-router";
import { useGuestStore } from "../stores/guest";
import GuestLayout from "../layouts/GuestLayout.vue";
import InfoBlock from "../components/InfoBlock.vue";
import Loader from "../components/Loader.vue";
import ErrorMessage from "../components/ErrorMessage.vue";

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
 * Обробка повторної спроби завантаження
 */
function handleRetry(): void {
  if (token) {
    guestStore.loadStayData(token);
  }
}
</script>

