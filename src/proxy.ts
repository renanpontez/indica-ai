import { NextRequest, NextResponse } from 'next/server';
import createIntlMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { updateSession } from './lib/supabase/middleware';
import {
  shouldBypassProxy,
  isPublicRoute,
  extractLocale,
  removeLocalePrefix,
  routes,
} from './lib/routes';

const intlMiddleware = createIntlMiddleware(routing);

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow bypassed routes (API, static files, auth callback, etc.)
  if (shouldBypassProxy(pathname)) {
    return NextResponse.next();
  }

  // Geo-based locale detection for first-time visitors (no NEXT_LOCALE cookie)
  const localeCookie = request.cookies.get('NEXT_LOCALE')?.value;
  let needsLocaleCookie = false;

  if (!localeCookie) {
    const country = request.headers.get('x-vercel-ip-country') || '';
    const detectedLocale = country === 'BR' || country === '' ? 'pt-BR' : 'en-US';

    if (detectedLocale === 'en-US') {
      // Non-BR visitor: redirect to /en-US/... and set cookie
      const firstVisitPath = removeLocalePrefix(pathname);
      const url = request.nextUrl.clone();
      url.pathname = `/en-US${firstVisitPath || '/'}`;
      const response = NextResponse.redirect(url);
      response.cookies.set('NEXT_LOCALE', 'en-US', { path: '/', maxAge: 31536000, sameSite: 'lax' });
      return response;
    }

    // BR visitor (or local dev): tell next-intl to use pt-BR and persist cookie on response
    request.cookies.set('NEXT_LOCALE', 'pt-BR');
    needsLocaleCookie = true;
  }

  // Update Supabase session (refresh tokens if needed)
  const { user, supabaseResponse } = await updateSession(request);

  // Extract locale and check route access
  const pathnameWithoutLocale = removeLocalePrefix(pathname);

  if (isPublicRoute(pathnameWithoutLocale)) {
    // Public route - allow access and let intl middleware handle locale
    const intlResponse = intlMiddleware(request);

    // Persist locale cookie for first-time BR visitors
    if (needsLocaleCookie) {
      intlResponse.cookies.set('NEXT_LOCALE', 'pt-BR', { path: '/', maxAge: 31536000, sameSite: 'lax' });
    }

    // Merge cookies from Supabase response
    supabaseResponse.cookies.getAll().forEach((cookie) => {
      intlResponse.cookies.set(cookie.name, cookie.value, cookie);
    });

    return intlResponse;
  }

  // Redirect to sign in if not authenticated
  if (!user) {
    const locale = extractLocale(pathname);
    const signInUrl = new URL(routes.auth.signin(locale, { callbackUrl: pathname }), request.url);
    const response = NextResponse.redirect(signInUrl);
    if (needsLocaleCookie) {
      response.cookies.set('NEXT_LOCALE', 'pt-BR', { path: '/', maxAge: 31536000, sameSite: 'lax' });
    }
    return response;
  }

  // Authenticated user accessing protected route
  const intlResponse = intlMiddleware(request);

  // Persist locale cookie for first-time BR visitors
  if (needsLocaleCookie) {
    intlResponse.cookies.set('NEXT_LOCALE', 'pt-BR', { path: '/', maxAge: 31536000, sameSite: 'lax' });
  }

  // Merge cookies from Supabase response
  supabaseResponse.cookies.getAll().forEach((cookie) => {
    intlResponse.cookies.set(cookie.name, cookie.value, cookie);
  });

  return intlResponse;
}

export const config = {
  // Match all pathnames except for:
  // - API routes (/api)
  // - Next.js internals (/_next, /_vercel)
  // - Static files (files with extensions like .ico, .png, etc.)
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)', '/([\\w-]+)?/users/(.+)'],
};
