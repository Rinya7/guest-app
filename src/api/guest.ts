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
  if ("message" in data && !("stayId" in data)) {
    throw new Error((data as GuestAccessErrorResponse).message);
  }

  return data as GuestStayView;
}

