import enGB from '../i18n/locales/en-GB.json';
import es from '../i18n/locales/es.json';
import type { Locale } from '../i18n';

const locales = {
  'en-GB': enGB,
  es: es,
} as const;

type TranslationPath = string; // e.g., 'common.home'
type NestedStringObject = { [key: string]: string | NestedStringObject };

function isNestedStringObject(obj: unknown): obj is NestedStringObject {
  return typeof obj === 'object' && obj !== null && !Array.isArray(obj);
}

export function t(locale: Locale, path: TranslationPath): string {
  const keys = path.split('.');
  let current: unknown = locales[locale];

  for (const key of keys) {
    if (isNestedStringObject(current) && key in current) {
      current = current[key];
    } else {
      // Fallback to English
      current = locales['en-GB'];
      for (const k of keys) {
        if (isNestedStringObject(current) && k in current) {
          current = current[k];
        } else {
          return path;
        }
      }
      break;
    }
  }

  return typeof current === 'string' ? current : path;
}

// Utility to get current locale from Astro context
export function getLocaleFromContext(locals: Record<string, unknown>): Locale {
  return (locals.locale as Locale) || 'en-GB';
}
