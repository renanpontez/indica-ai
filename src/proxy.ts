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

  // Update Supabase session (refresh tokens if needed)
  const { user, supabaseResponse } = await updateSession(request);

  // Extract locale and check route access
  const pathnameWithoutLocale = removeLocalePrefix(pathname);

  if (isPublicRoute(pathnameWithoutLocale)) {
    // Public route - allow access and let intl middleware handle locale
    const intlResponse = intlMiddleware(request);

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
    return NextResponse.redirect(signInUrl);
  }

  // Authenticated user accessing protected route
  const intlResponse = intlMiddleware(request);

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
