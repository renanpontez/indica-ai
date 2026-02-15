/**
 * Route configuration for the application
 * Centralizes all route definitions for middleware/proxy, navigation, and URL generation
 */

// ============================================================================
// Types
// ============================================================================

export type Locale = 'pt-BR' | 'en-US';

export const locales: Locale[] = ['pt-BR', 'en-US'];
export const defaultLocale: Locale = 'pt-BR';

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

// Query parameters type helper
type QueryParams = Record<string, string | number | boolean | undefined | null>;

// ============================================================================
// Route Path Definitions (without locale prefix)
// ============================================================================

/**
 * All route paths in the application.
 * These are the base paths without locale prefix.
 */
export const ROUTE_PATHS = {
  // Public routes
  home: '/',

  // Auth routes
  auth: {
    signin: '/auth/signin',
    signup: '/auth/signup',
    error: '/auth/error',
    callback: '/auth/callback',
  },

  // Legal routes
  legal: {
    terms: '/legal/terms',
    privacy: '/legal/privacy',
  },

  // Contact
  contact: '/contact',

  // App routes (require authentication)
  app: {
    feed: '/app',
    add: '/app/add',
    explore: {
      index: '/app/explore',
      all: '/app/explore/all',
      cities: '/app/explore/cities',
      city: (slug: string) => `/app/explore/cities/${slug}`,
      tag: (slug: string) => `/app/explore/tag/${slug}`,
    },
    experience: {
      detail: (id: string, slug: string) => `/app/experience/${id}/${slug}`,
      edit: (id: string) => `/app/experience/${id}/edit`,
    },
    profile: {
      view: (userId: string) => `/app/profile/${userId}`,
      me: '/app/profile/me',
    },
  },
} as const;

// ============================================================================
// URL Builder Utilities
// ============================================================================

/**
 * Build query string from params object.
 * Filters out undefined/null values.
 */
function buildQueryString(params?: QueryParams): string {
  if (!params) return '';

  const entries = Object.entries(params)
    .filter(([, value]) => value !== undefined && value !== null)
    .map(
      ([key, value]) =>
        `${encodeURIComponent(key)}=${encodeURIComponent(String(value))}`
    );

  return entries.length > 0 ? `?${entries.join('&')}` : '';
}

/**
 * Build a locale-prefixed URL.
 */
function buildUrl(locale: Locale, path: string, params?: QueryParams): string {
  const query = buildQueryString(params);
  return `/${locale}${path}${query}`;
}

// ============================================================================
// Type-Safe Route Builders
// ============================================================================

/**
 * Route builders that generate locale-aware URLs.
 *
 * Usage:
 *   routes.home(locale)                           -> /pt-BR/
 *   routes.auth.signin(locale)                    -> /pt-BR/auth/signin
 *   routes.app.feed(locale)                       -> /pt-BR/app
 *   routes.app.explore.index(locale)              -> /pt-BR/app/explore
 *   routes.app.explore.all(locale, { city: 'SP' }) -> /pt-BR/app/explore/all?city=SP
 *   routes.app.experience.detail(locale, id, slug) -> /pt-BR/app/experience/{id}/{slug}
 *   routes.app.profile.me(locale, { tab: 'bookmarks' }) -> /pt-BR/app/profile/me?tab=bookmarks
 */
export const routes = {
  // Public routes
  home: (locale: Locale, params?: QueryParams) =>
    buildUrl(locale, ROUTE_PATHS.home, params),

  // Auth routes
  auth: {
    signin: (locale: Locale, params?: { callbackUrl?: string }) =>
      buildUrl(locale, ROUTE_PATHS.auth.signin, params),

    signup: (locale: Locale, params?: { callbackUrl?: string }) =>
      buildUrl(locale, ROUTE_PATHS.auth.signup, params),

    error: (locale: Locale, params?: { error?: string }) =>
      buildUrl(locale, ROUTE_PATHS.auth.error, params),

    // Callback doesn't need locale (bypasses i18n)
    callback: () => ROUTE_PATHS.auth.callback,
  },

  // Legal routes
  legal: {
    terms: (locale: Locale) => buildUrl(locale, ROUTE_PATHS.legal.terms),

    privacy: (locale: Locale) => buildUrl(locale, ROUTE_PATHS.legal.privacy),
  },

  // Contact
  contact: (locale: Locale) => buildUrl(locale, ROUTE_PATHS.contact),

  // App routes
  app: {
    feed: (locale: Locale, params?: QueryParams) =>
      buildUrl(locale, ROUTE_PATHS.app.feed, params),

    add: (locale: Locale, params?: QueryParams) =>
      buildUrl(locale, ROUTE_PATHS.app.add, params),

    explore: {
      index: (locale: Locale, params?: { city?: string }) =>
        buildUrl(locale, ROUTE_PATHS.app.explore.index, params),

      all: (locale: Locale, params?: { city?: string; tag?: string }) =>
        buildUrl(locale, ROUTE_PATHS.app.explore.all, params),

      cities: (locale: Locale) =>
        buildUrl(locale, ROUTE_PATHS.app.explore.cities),

      city: (locale: Locale, slug: string, params?: QueryParams) =>
        buildUrl(locale, ROUTE_PATHS.app.explore.city(slug), params),

      tag: (locale: Locale, slug: string, params?: QueryParams) =>
        buildUrl(locale, ROUTE_PATHS.app.explore.tag(slug), params),
    },

    experience: {
      detail: (
        locale: Locale,
        id: string,
        slug: string,
        params?: QueryParams
      ) => buildUrl(locale, ROUTE_PATHS.app.experience.detail(id, slug), params),

      edit: (locale: Locale, id: string, params?: QueryParams) =>
        buildUrl(locale, ROUTE_PATHS.app.experience.edit(id), params),
    },

    profile: {
      view: (
        locale: Locale,
        userId: string,
        params?: { tab?: 'experiences' | 'bookmarks' }
      ) => buildUrl(locale, ROUTE_PATHS.app.profile.view(userId), params),

      me: (locale: Locale, params?: { tab?: 'experiences' | 'bookmarks' }) =>
        buildUrl(locale, ROUTE_PATHS.app.profile.me, params),
    },
  },
} as const;

// ============================================================================
// Route Helpers for next-intl Link component
// These return paths WITHOUT locale prefix for use with next-intl's Link
// ============================================================================

/**
 * Route paths for use with next-intl's Link component.
 * The Link component from '@/i18n/routing' automatically handles locale.
 *
 * Usage with next-intl Link:
 *   <Link href={routePaths.app.feed()}>Feed</Link>
 *   <Link href={routePaths.app.explore.tag('coffee')}>Coffee</Link>
 *   <Link href={routePaths.app.profile.me({ tab: 'bookmarks' })}>Bookmarks</Link>
 */
export const routePaths = {
  home: (params?: QueryParams) => ROUTE_PATHS.home + buildQueryString(params),

  auth: {
    signin: (params?: { callbackUrl?: string }) =>
      ROUTE_PATHS.auth.signin + buildQueryString(params),

    signup: (params?: { callbackUrl?: string }) =>
      ROUTE_PATHS.auth.signup + buildQueryString(params),

    error: (params?: { error?: string }) =>
      ROUTE_PATHS.auth.error + buildQueryString(params),
  },

  legal: {
    terms: () => ROUTE_PATHS.legal.terms,
    privacy: () => ROUTE_PATHS.legal.privacy,
  },

  contact: () => ROUTE_PATHS.contact,

  app: {
    feed: (params?: QueryParams) =>
      ROUTE_PATHS.app.feed + buildQueryString(params),

    add: (params?: QueryParams) =>
      ROUTE_PATHS.app.add + buildQueryString(params),

    explore: {
      index: (params?: { city?: string }) =>
        ROUTE_PATHS.app.explore.index + buildQueryString(params),

      all: (params?: { city?: string; tag?: string }) =>
        ROUTE_PATHS.app.explore.all + buildQueryString(params),

      cities: () => ROUTE_PATHS.app.explore.cities,

      city: (slug: string, params?: QueryParams) =>
        ROUTE_PATHS.app.explore.city(slug) + buildQueryString(params),

      tag: (slug: string, params?: QueryParams) =>
        ROUTE_PATHS.app.explore.tag(slug) + buildQueryString(params),
    },

    experience: {
      detail: (id: string, slug: string, params?: QueryParams) =>
        ROUTE_PATHS.app.experience.detail(id, slug) + buildQueryString(params),

      edit: (id: string, params?: QueryParams) =>
        ROUTE_PATHS.app.experience.edit(id) + buildQueryString(params),
    },

    profile: {
      view: (userId: string, params?: { tab?: 'experiences' | 'bookmarks' }) =>
        ROUTE_PATHS.app.profile.view(userId) + buildQueryString(params),

      me: (params?: { tab?: 'experiences' | 'bookmarks' }) =>
        ROUTE_PATHS.app.profile.me + buildQueryString(params),
    },
  },
} as const;

// ============================================================================
// Navigation Items (Bottom Nav)
// Updated to use route paths
// ============================================================================

export const navItems: NavItem[] = [
  {
    key: 'feed',
    path: ROUTE_PATHS.app.feed,
    translationKey: 'feed',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25',
    },
  },
  {
    key: 'add',
    path: ROUTE_PATHS.app.add,
    translationKey: 'add',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M12 4v16m8-8H4',
    },
  },
  {
    key: 'explore',
    path: ROUTE_PATHS.app.explore.index,
    translationKey: 'explore',
    icon: {
      viewBox: '0 0 24 24',
      path: 'M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z',
    },
  },
  // {
  //   key: 'profile',
  //   path: ROUTE_PATHS.app.profile.me,
  //   translationKey: 'profile',
  //   icon: {
  //     viewBox: '0 0 24 24',
  //     path: '',
  //   },
  //   useAvatar: true,
  // },
];

// ============================================================================
// Middleware Route Configuration
// ============================================================================

// Routes that don't require authentication
export const publicRoutes = [
  ROUTE_PATHS.home,
  ROUTE_PATHS.auth.signin,
  ROUTE_PATHS.auth.signup,
  ROUTE_PATHS.auth.error,
  ROUTE_PATHS.auth.callback,
  ROUTE_PATHS.legal.terms,
  ROUTE_PATHS.legal.privacy,
  ROUTE_PATHS.contact,
] as const;

// Routes that require authentication (all under /app)
export const privateRoutes = ['/app'] as const;

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

// ============================================================================
// Utility Functions
// ============================================================================

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
export function extractLocale(pathname: string): Locale {
  const match = pathname.match(localePattern);
  const extracted = match ? match[1] : defaultLocale;
  return locales.includes(extracted as Locale)
    ? (extracted as Locale)
    : defaultLocale;
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

/**
 * Check if a locale is valid
 */
export function isValidLocale(locale: string): locale is Locale {
  return locales.includes(locale as Locale);
}

/**
 * Get navItems with locale-prefixed paths for direct use
 */
export function getNavItemsWithLocale(locale: Locale): NavItem[] {
  return navItems.map((item) => ({
    ...item,
    path: `/${locale}${item.path}`,
  }));
}
