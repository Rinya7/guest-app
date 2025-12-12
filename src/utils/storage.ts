// src/utils/storage.ts
// IndexedDB утиліта для зберігання даних гостя offline
// Вибір IndexedDB замість LocalStorage:
// - Підтримка великих об'єктів (GuestStayView може містити багато даних)
// - Асинхронні операції (не блокує UI)
// - Структуровані дані з індексами
// - Краща підтримка в PWA контексті
//
// Безпека: Токен зберігається як ключ в IndexedDB (не в даних).
// IndexedDB доступний тільки для цього домену (same-origin policy).
// Токен ніколи не логується в console (перевірено в коді).

const DB_NAME = "hotel-guest-pwa";
const DB_VERSION = 1;
const STORE_NAME = "stayData";

interface StoredStayData {
  token: string;
  data: unknown; // GuestStayView
  timestamp: number;
  version: number;
}

let dbInstance: IDBDatabase | null = null;

/**
 * Відкрити з'єднання з IndexedDB
 */
function openDB(): Promise<IDBDatabase> {
  if (dbInstance) {
    return Promise.resolve(dbInstance);
  }

  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => {
      reject(new Error("Failed to open IndexedDB"));
    };

    request.onsuccess = () => {
      dbInstance = request.result;
      resolve(dbInstance);
    };

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        const store = db.createObjectStore(STORE_NAME, { keyPath: "token" });
        store.createIndex("timestamp", "timestamp", { unique: false });
      }
    };
  });
}

/**
 * Зберегти дані про проживання для токена
 * @param token - токен доступу
 * @param data - дані про проживання
 */
export async function saveStayData(
  token: string,
  data: unknown
): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    const storedData: StoredStayData = {
      token,
      data,
      timestamp: Date.now(),
      version: DB_VERSION,
    };

    await new Promise<void>((resolve, reject) => {
      const request = store.put(storedData);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Failed to save data"));
    });
  } catch (error) {
    console.error("[Storage] Failed to save stay data:", error);
    // Не кидаємо помилку - це не критично для роботи додатку
  }
}

/**
 * Отримати збережені дані про проживання для токена
 * @param token - токен доступу
 * @returns Дані про проживання або null
 */
export async function getStayData(token: string): Promise<unknown | null> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readonly");
    const store = transaction.objectStore(STORE_NAME);

    return new Promise<unknown | null>((resolve, reject) => {
      const request = store.get(token);
      request.onsuccess = () => {
        const result = request.result as StoredStayData | undefined;
        if (result && result.version === DB_VERSION) {
          resolve(result.data);
        } else {
          resolve(null);
        }
      };
      request.onerror = () => reject(new Error("Failed to get data"));
    });
  } catch (error) {
    console.error("[Storage] Failed to get stay data:", error);
    return null;
  }
}

/**
 * Видалити дані для токена
 * @param token - токен доступу
 */
export async function deleteStayData(token: string): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);

    await new Promise<void>((resolve, reject) => {
      const request = store.delete(token);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(new Error("Failed to delete data"));
    });
  } catch (error) {
    console.error("[Storage] Failed to delete stay data:", error);
  }
}

/**
 * Очистити всі застарілі дані (старіше 30 днів)
 */
export async function cleanupOldData(): Promise<void> {
  try {
    const db = await openDB();
    const transaction = db.transaction([STORE_NAME], "readwrite");
    const store = transaction.objectStore(STORE_NAME);
    const index = store.index("timestamp");

    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;

    return new Promise<void>((resolve, reject) => {
      const request = index.openCursor(IDBKeyRange.upperBound(thirtyDaysAgo));
      request.onsuccess = (event) => {
        const cursor = (event.target as IDBRequest<IDBCursorWithValue>).result;
        if (cursor) {
          cursor.delete();
          cursor.continue();
        } else {
          resolve();
        }
      };
      request.onerror = () => reject(new Error("Failed to cleanup"));
    });
  } catch (error) {
    console.error("[Storage] Failed to cleanup old data:", error);
  }
}

