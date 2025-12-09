// src/types/guest.ts
// Типи даних для Guest API (синхронізовано з hotel-backend/src/types/guest.ts)

// Статус проживання, який ми показуємо гостю
export type GuestStayStatus = "booked" | "occupied" | "completed" | "cancelled";

// Об'єкт, який отримає гість при відкритті лінку
export interface GuestStayView {
  stayId: number;
  hotelName: string | null;
  hotelAddress: string | null;
  
  // Координати готелю для відображення на карті
  hotelLatitude: string | null;
  hotelLongitude: string | null;

  roomNumber: string;
  stayStatus: GuestStayStatus;

  checkIn: string; // YYYY-MM-DD
  checkOut: string; // YYYY-MM-DD

  mainGuestName: string;
  // Дані основного гостя з Stay
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phoneCountryCode: string | null;
  phoneNumber: string | null;
  guestsCount: number | null;
  
  extraGuestNames: string[];

  // Політика заїзду / виїзду (з адміна)
  policyCheckInHour: number | null;
  policyCheckOutHour: number | null;

  // Wi-Fi (можливі null, якщо не налаштовано) Тільки якщо status === occupied
  wifiName: string | null;
  wifiPassword: string | null;

  // Контакти готелю (обов'язково не робимо їх required — мало що)
  contactPhone: string | null;
  contactEmail: string | null;
}

// Помилка доступу (коли токен невалідний, прострочений або відкликаний)
export interface GuestAccessErrorResponse {
  message: string;
}

