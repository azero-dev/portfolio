// i18n configuration placeholder
// To be implemented with astro-i18n or similar library

export const i18nConfig = {
  defaultLocale: 'en-GB',
  locales: ['en-GB', 'es'] as const,
};

export type Locale = typeof i18nConfig.locales[number];
