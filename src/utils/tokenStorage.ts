// src/utils/tokenStorage.ts
// Утиліта для зберігання та відновлення токену доступу гостя
// Використовується для PWA: при запуску з home screen токен зберігається в localStorage

const TOKEN_STORAGE_KEY = "guest_access_token";

/**
 * Зберегти токен доступу в localStorage
 * @param token - токен доступу
 */
export function saveToken(token: string): void {
  try {
    localStorage.setItem(TOKEN_STORAGE_KEY, token);
  } catch (err) {
    console.warn("Не вдалося зберегти токен:", err);
  }
}

/**
 * Отримати збережений токен з localStorage
 * @returns токен або null, якщо не знайдено
 */
export function getToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_STORAGE_KEY);
  } catch (err) {
    console.warn("Не вдалося отримати токен:", err);
    return null;
  }
}

/**
 * Видалити збережений токен з localStorage
 */
export function clearToken(): void {
  try {
    localStorage.removeItem(TOKEN_STORAGE_KEY);
  } catch (err) {
    console.warn("Не вдалося видалити токен:", err);
  }
}
