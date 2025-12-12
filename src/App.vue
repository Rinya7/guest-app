<template>
  <div id="app">
    <!-- Статус online/offline -->
    <OnlineStatus />
    <!-- Сповіщення про оновлення -->
    <UpdateNotification />
    <RouterView />
  </div>
</template>

<script setup lang="ts">
// src/App.vue
// Головний компонент додатку
import { RouterView } from "vue-router";
import OnlineStatus from "./components/OnlineStatus.vue";
import UpdateNotification from "./components/UpdateNotification.vue";
</script>

<style>
/* Глобальні стилі */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
    Ubuntu, Cantarell, "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#app {
  min-height: 100vh;
}
</style>

