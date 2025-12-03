<template>
  <!-- Сторінка з інформацією про Wi-Fi -->
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
      <InfoBlock title="Wi-Fi інформація">
        <!-- Перевіряємо статус - Wi-Fi доступний тільки для occupied -->
        <div v-if="guestStore.stayData.stayStatus !== 'occupied'" class="text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M18.364 5.636a9 9 0 010 12.728m0 0l-2.829-2.829m2.829 2.829L21 21M15.536 8.464a5 5 0 010 7.072m0 0l-2.829-2.829m-4.243 2.829a4.978 4.978 0 01-1.414-2.83m-1.414 5.658a9 9 0 01-2.167-9.238m7.824 2.167a1 1 0 111.414 1.414m-1.414-1.414L3 3m8.293 8.293l1.414 1.414"
            />
          </svg>
          <p class="mt-4 text-lg text-gray-600 dark:text-gray-400">
            Wi-Fi інформація буде доступна після заселення
          </p>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-500">
            Статус: {{ getStatusLabel(guestStore.stayData.stayStatus) }}
          </p>
        </div>

        <!-- Wi-Fi дані для occupied -->
        <div v-else-if="wifiName && wifiPassword" class="space-y-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Назва мережі (SSID)</p>
            <div class="flex items-center gap-2">
              <input
                :value="wifiName"
                readonly
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 font-mono"
              />
              <button
                @click="copyToClipboard(wifiName)"
                class="btn btn-secondary text-sm"
                title="Копіювати"
              >
                Копіювати
              </button>
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mb-1">Пароль</p>
            <div class="flex items-center gap-2">
              <input
                :type="showPassword ? 'text' : 'password'"
                :value="wifiPassword"
                readonly
                class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-gray-50 dark:bg-gray-700 font-mono"
              />
              <button
                @click="showPassword = !showPassword"
                class="btn btn-secondary text-sm"
                :title="showPassword ? 'Приховати' : 'Показати'"
              >
                {{ showPassword ? "Приховати" : "Показати" }}
              </button>
              <button
                @click="copyToClipboard(wifiPassword)"
                class="btn btn-secondary text-sm"
                title="Копіювати"
              >
                Копіювати
              </button>
            </div>
          </div>
        </div>

        <!-- Wi-Fi не налаштовано -->
        <div v-else class="text-center py-8">
          <p class="text-gray-600 dark:text-gray-400">
            Wi-Fi інформація не налаштована для цього номера
          </p>
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
// src/pages/WifiPage.vue
// Сторінка з інформацією про Wi-Fi
// Показує Wi-Fi дані тільки для статусу "occupied"
// Для інших статусів показує повідомлення про недоступність

import { ref, computed, onMounted } from "vue";
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
const showPassword = ref(false);

// Завантажуємо дані, якщо їх немає (наприклад, після перезавантаження сторінки)
onMounted(async () => {
  if (!guestStore.stayData && token) {
    await guestStore.loadStayData(token);
  }
});

// Отримуємо Wi-Fi дані
const wifiName = computed(() => guestStore.stayData?.wifiName ?? null);
const wifiPassword = computed(() => guestStore.stayData?.wifiPassword ?? null);

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

/**
 * Обробка повторної спроби завантаження
 */
function handleRetry(): void {
  if (token) {
    guestStore.loadStayData(token);
  }
}

/**
 * Копіювати текст в буфер обміну
 */
async function copyToClipboard(text: string): Promise<void> {
  try {
    await navigator.clipboard.writeText(text);
    // Можна додати toast-повідомлення про успішне копіювання
    alert("Скопійовано в буфер обміну");
  } catch (err) {
    console.error("Помилка копіювання:", err);
    alert("Не вдалося скопіювати");
  }
}
</script>

