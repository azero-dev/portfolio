import enGB from '../i18n/locales/en-GB.json';
import es from '../i18n/locales/es.json';
import type { Locale } from '../i18n';

const locales = {
  'en-GB': enGB,
  'es': es,
} as const;

type TranslationPath = string; // e.g., 'common.home'

export function t(locale: Locale, path: TranslationPath): string {
  const keys = path.split('.');
  let current: any = locales[locale];
  
  for (const key of keys) {
    if (current && typeof current === 'object' && key in current) {
      current = current[key];
    } else {
      // Fallback to English
      current = locales['en-GB'];
      for (const k of keys) {
        if (current && typeof current === 'object' && k in current) {
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
export function getLocaleFromContext(locals: any): Locale {
  return locals.locale || 'en-GB';
}
