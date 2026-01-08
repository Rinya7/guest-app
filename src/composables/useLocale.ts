/// src/composables/useLocale.ts
import { computed } from "vue";
import { useI18n } from "vue-i18n";
import {
  SUPPORTED_LOCALES,
  type SupportedLocale,
  type MessageSchema,
  setLocale,
} from "@/i18n";

export function useLocale() {
  const { t, d, n, locale } = useI18n<
    { message: MessageSchema },
    SupportedLocale
  >();
  const current = computed<SupportedLocale>(
    () => locale.value as SupportedLocale
  );
  function change(next: SupportedLocale): void {
    setLocale(next);
  }
  return { t, d, n, current, supportedLocales: SUPPORTED_LOCALES, change };
}





