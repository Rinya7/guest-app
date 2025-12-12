// src/api/guest.ts
// API функції для роботи з Guest API

import http from "./http";
import type { GuestStayView, GuestAccessErrorResponse } from "../types/guest";

/**
 * Отримати інформацію про проживання по токену
 * @param token - токен доступу гостя
 * @returns Дані про проживання або помилку
 */
export async function getGuestAccessByToken(
  token: string
): Promise<GuestStayView> {
  const { data } = await http.get<GuestStayView | GuestAccessErrorResponse>(
    `/guest/access/${encodeURIComponent(token)}`
  );

  // Перевіряємо, чи це помилка
  // Перевіряємо наявність stayId як основного поля успішного відповіді
  if (!data || typeof data !== "object" || !("stayId" in data)) {
    // Якщо це об'єкт помилки з повідомленням
    if (data && typeof data === "object" && "message" in data) {
      throw new Error((data as GuestAccessErrorResponse).message);
    }
    throw new Error("Невідома помилка при отриманні даних");
  }

  return data as GuestStayView;
}

