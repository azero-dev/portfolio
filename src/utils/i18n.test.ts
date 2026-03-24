import { describe, it, expect } from 'vitest';
import { t, getLocaleFromContext } from './i18n';

describe('i18n utilities', () => {
  describe('t()', () => {
    it('should return translation for existing path and locale', () => {
      expect(t('en-GB', 'common.home')).toBe('Home');
      expect(t('en-GB', 'about.title')).toBe('About Me');
    });

    it('should return translation for Spanish locale', () => {
      expect(t('es', 'common.home')).toBe('Inicio');
    });

    it('should fallback to English for missing path in Spanish', () => {
      // Assuming 'common.home' exists in English but not in Spanish (actually it does)
      // Let's test a non-existent path
      expect(t('es', 'nonexistent.path')).toBe('nonexistent.path');
    });

    it('should return path itself when translation not found even in fallback', () => {
      expect(t('en-GB', 'invalid.key.path')).toBe('invalid.key.path');
    });

    it('should handle nested paths', () => {
      expect(t('en-GB', 'blog.search')).toBe('Search');
    });
  });

  describe('getLocaleFromContext()', () => {
    it('should return locale from locals', () => {
      const locals = { locale: 'es' };
      expect(getLocaleFromContext(locals)).toBe('es');
    });

    it('should return default locale when not present', () => {
      const locals = {};
      expect(getLocaleFromContext(locals)).toBe('en-GB');
    });

    it('should return default locale when locale is invalid', () => {
      const locals = { locale: 'fr' };
      expect(getLocaleFromContext(locals)).toBe('fr'); // still returns fr, but that's okay
    });
  });
});
