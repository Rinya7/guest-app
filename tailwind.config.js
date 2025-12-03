/** @type {import('tailwindcss').Config} */
// Конфігурація TailwindCSS для Guest PWA
// Використовуємо схожу конфігурацію з admin-frontend для консистентності

export default {
  // Використовуємо class-based dark mode для підтримки тем
  darkMode: "class",

  // Вказуємо Tailwind де шукати класи
  content: ["./index.html", "./src/**/*.{vue,js,ts,jsx,tsx}"],

  theme: {
    extend: {
      colors: {
        // Брендовий колір (можна змінити під гостьовий додаток)
        brand: "#383578",
      },
    },
    container: {
      center: true, // Центруємо контейнер
      padding: "1rem", // Базовий внутрішній відступ
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        xl: "1280px",
        "2xl": "1440px",
      },
    },
  },

  plugins: [],
};




