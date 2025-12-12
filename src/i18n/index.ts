import { createI18n } from "vue-i18n";
import type { Ref } from "vue";
import uk from "./locales/uk";
import en from "./locales/en";
import de from "./locales/de";
import it from "./locales/it";

export const SUPPORTED_LOCALES = ["uk", "en", "de", "it"] as const;
export type SupportedLocale = (typeof SUPPORTED_LOCALES)[number];

export type MessageSchema = {
  [key: string]: string | MessageSchema;
};

const messages: Record<SupportedLocale, MessageSchema> = { uk, en, de, it };

const numberFormats = {
  uk: { currency: { style: "currency", currency: "EUR" } },
  en: { currency: { style: "currency", currency: "EUR" } },
  de: { currency: { style: "currency", currency: "EUR" } },
  it: { currency: { style: "currency", currency: "EUR" } },
} as const;

const datetimeFormats = {
  uk: { short: { year: "numeric", month: "2-digit", day: "2-digit" } },
  en: { short: { year: "numeric", month: "2-digit", day: "2-digit" } },
  de: { short: { year: "numeric", month: "2-digit", day: "2-digit" } },
  it: { short: { year: "numeric", month: "2-digit", day: "2-digit" } },
} as const;

function getStoredLocale(): SupportedLocale | null {
  const raw = localStorage.getItem("locale");
  if (!raw) return null;
  return SUPPORTED_LOCALES.includes(raw as SupportedLocale)
    ? (raw as SupportedLocale)
    : null;
}

function getBrowserLocale(): SupportedLocale {
  const lang = navigator.language.toLowerCase();
  if (lang.startsWith("uk") || lang.startsWith("ru")) return "uk";
  if (lang.startsWith("de")) return "de";
  if (lang.startsWith("it")) return "it";
  return "en";
}

const initialLocale: SupportedLocale =
  getStoredLocale() ?? getBrowserLocale() ?? "en";

export const i18n = createI18n<[MessageSchema], SupportedLocale>({
  legacy: false,
  locale: initialLocale,
  fallbackLocale: "en",
  messages,
  numberFormats,
  datetimeFormats,
  missingWarn: false,
  fallbackWarn: false,
});

export function setLocale(locale: SupportedLocale): void {
  if (!SUPPORTED_LOCALES.includes(locale)) return;

  // 👇 Без помилки: спочатку unknown, потім Ref<string>
  (i18n.global.locale as unknown as Ref<string>).value = locale;

  localStorage.setItem("locale", locale);
  document.documentElement.lang = locale;
}

