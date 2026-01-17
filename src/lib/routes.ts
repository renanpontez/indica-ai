/**
 * Route configuration for the application
 * Centralizes all route definitions for middleware/proxy and navigation
 */

// Routes that don't require authentication
export const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/auth/callback',
  '/explore',
  '/experience',
] as const;

// Routes that require authentication (all under /app)
export const privateRoutes = [
  '/app',
] as const;

// Routes that should completely bypass the proxy (no i18n, no auth check)
export const bypassRoutes = {
  // Exact path matches
  exact: ['/auth/callback'] as const,
  // Prefix matches (startsWith)
  prefixes: ['/api', '/_next', '/_vercel'] as const,
};

// Regex to detect static files (files with extensions)
export const staticFilePattern = /\.[^/]+$/;

// Locale pattern for extracting locale from pathname
export const localePattern = /^\/([a-z]{2}-[A-Z]{2})/;

// Default locale when none is detected
export const defaultLocale = 'pt-BR';

/**
 * Check if a path should completely bypass the proxy
 */
export function shouldBypassProxy(pathname: string): boolean {
  // Check exact matches
  if (bypassRoutes.exact.some((route) => pathname === route)) {
    return true;
  }

  // Check prefix matches
  if (bypassRoutes.prefixes.some((prefix) => pathname.startsWith(prefix))) {
    return true;
  }

  // Check for static files
  if (staticFilePattern.test(pathname)) {
    return true;
  }

  return false;
}

/**
 * Extract locale from pathname
 */
export function extractLocale(pathname: string): string {
  const match = pathname.match(localePattern);
  return match ? match[1] : defaultLocale;
}

/**
 * Remove locale prefix from pathname
 */
export function removeLocalePrefix(pathname: string): string {
  return pathname.replace(localePattern, '');
}

/**
 * Check if a path (without locale) is a public route
 */
export function isPublicRoute(pathnameWithoutLocale: string): boolean {
  return publicRoutes.some((route) => {
    if (route === '/') {
      return pathnameWithoutLocale === '' || pathnameWithoutLocale === '/';
    }
    return pathnameWithoutLocale.startsWith(route);
  });
}
