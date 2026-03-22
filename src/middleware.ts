import { defineMiddleware } from 'astro/middleware';

// Middleware for i18n - to be implemented fully later
export const onRequest = defineMiddleware(async (context, next) => {
  // TODO: Implement locale detection and redirection
  return next();
});
