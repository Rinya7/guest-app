// src/router/index.ts
// Конфігурація маршрутизації для Guest PWA
// Роути для доступу по токену

import { createRouter, createWebHistory } from "vue-router";
import type { RouteRecordRaw } from "vue-router";

const routes: RouteRecordRaw[] = [
  {
    path: "/",
    name: "home",
    component: () => import("../pages/AccessPage.vue"),
    // Головна сторінка - показує повідомлення про необхідність токену
  },
  {
    path: "/access/:token",
    name: "guest-access",
    component: () => import("../pages/AccessPage.vue"),
    props: true,
  },
  {
    path: "/access/:token/stay",
    name: "stay-info",
    component: () => import("../pages/StayInfoPage.vue"),
    props: true,
  },
  {
    path: "/access/:token/wifi",
    name: "wifi",
    component: () => import("../pages/WifiPage.vue"),
    props: true,
  },
  {
    path: "/access/:token/contact",
    name: "contact",
    component: () => import("../pages/ContactPage.vue"),
    props: true,
  },
  {
    path: "/access/:token/completed",
    name: "completed",
    component: () => import("../pages/CompletedPage.vue"),
    props: true,
  },
  {
    path: "/access/:token/cancelled",
    name: "cancelled",
    component: () => import("../pages/CancelledPage.vue"),
    props: true,
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
