/**
 * Route configuration for the application
 * Centralizes all route definitions for middleware/proxy and navigation
 */

// Navigation item type for bottom nav
export type NavItem = {
  key: string;
  path: string;
  translationKey: string;
  icon: {
    viewBox: string;
    path: string;
  };
  // Whether to use avatar instead of icon (for profile)
  useAvatar?: boolean;
};

// Bottom navigation items
export const navItems: NavItem[] = [
  {
    key: 'feed',
    path: '/app',
    translationKey: 'feed',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
    },
  },
  {
    key: 'explore',
    path: '/app/explore',
    translationKey: 'explore',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
    },
  },
  {
    key: 'add',
    path: '/app/add',
    translationKey: 'add',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M12 4v16m8-8H4',
    },
  },
  {
    key: 'profile',
    path: '/app/profile/me',
    translationKey: 'profile',
    icon: {
      viewBox: '0 0 24 24',
      path: '',
    },
    useAvatar: true,
  },
];

// Routes that don't require authentication
export const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/auth/callback',
  '/legal/terms',
  '/legal/privacy',
  '/contact',
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
