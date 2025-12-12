<template>
  <!-- Language switcher with dropdown menu -->
  <div class="inline-flex gap-2 relative" :aria-label="t('common.language')">
    <!-- Dropdown container -->
    <div class="relative" ref="dropdownRef">
      <!-- Current language button with dropdown trigger -->
      <button
        type="button"
        @click="toggleDropdown"
        class="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
      >
        <span>{{ current.toUpperCase() }}</span>
        <span class="text-xs" :class="{ 'rotate-180': isOpen }">▼</span>
      </button>

      <!-- Dropdown menu -->
      <Transition
        enter-active-class="transition ease-out duration-100"
        enter-from-class="opacity-0 scale-95"
        enter-to-class="opacity-100 scale-100"
        leave-active-class="transition ease-in duration-75"
        leave-from-class="opacity-100 scale-100"
        leave-to-class="opacity-0 scale-95"
      >
        <div
          v-if="isOpen"
          class="absolute top-full left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-md shadow-lg z-50 overflow-hidden"
          role="menu"
          aria-orientation="vertical"
        >
          <button
            v-for="code in otherLocales"
            :key="code"
            type="button"
            class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-blue-600 hover:text-white dark:hover:bg-blue-600 dark:hover:text-white transition-colors duration-150"
            role="menuitem"
            @click="handleLanguageChange(code)"
          >
            {{ code.toUpperCase() }}
          </button>
        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Language switcher with dropdown menu
 * - Shows current language in a button
 * - Opens dropdown menu on click with other available languages
 * - Closes menu after language selection or click outside
 */
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useLocale } from "@/composables/useLocale";

const { t, current, supportedLocales, change } = useLocale();

// Dropdown state
const isOpen = ref(false);
const dropdownRef = ref<HTMLElement | null>(null);

// Filter out current language from the list
const otherLocales = computed(() => {
  return supportedLocales.filter((code) => code !== current.value);
});

// Toggle dropdown menu
function toggleDropdown(): void {
  isOpen.value = !isOpen.value;
}

// Handle language change and close menu
function handleLanguageChange(code: string): void {
  change(code as typeof current.value);
  isOpen.value = false;
}

// Close dropdown when clicking outside
function handleClickOutside(event: MouseEvent): void {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
    isOpen.value = false;
  }
}

// Add/remove click outside listener
onMounted(() => {
  document.addEventListener("click", handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener("click", handleClickOutside);
});
</script>

