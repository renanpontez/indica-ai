import { NextRequest, NextResponse } from 'next/server';
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { getToken } from 'next-auth/jwt';

const intlMiddleware = createMiddleware(routing);

// Public routes that don't require authentication
const publicRoutes = [
  '/',
  '/auth/signin',
  '/auth/signup',
  '/auth/error',
  '/explore',
  '/experience',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow API routes and static files
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.startsWith('/_vercel') ||
    pathname.match(/\.[^/]+$/)
  ) {
    return NextResponse.next();
  }

  // Extract locale from pathname (e.g., /pt-BR/auth/signin -> /auth/signin)
  const pathnameWithoutLocale = pathname.replace(/^\/[a-z]{2}-[A-Z]{2}/, '');

  // Check if this is a public route (before checking authentication)
  const isPublicRoute = publicRoutes.some((route) => {
    if (route === '/') {
      return pathnameWithoutLocale === '' || pathnameWithoutLocale === '/';
    }
    return pathnameWithoutLocale.startsWith(route);
  });

  if (isPublicRoute) {
    // Public route - allow access and let intl middleware handle locale
    return intlMiddleware(request);
  }

  // Check authentication for protected routes
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  // Redirect to sign in if not authenticated
  if (!token) {
    // Get current locale from pathname or use default
    const localeMatch = pathname.match(/^\/([a-z]{2}-[A-Z]{2})/);
    const locale = localeMatch ? localeMatch[1] : 'pt-BR';

    const signInUrl = new URL(`/${locale}/auth/signin`, request.url);
    signInUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(signInUrl);
  }

  return intlMiddleware(request);
}

export const config = {
  // Match only internationalized pathnames
  matcher: [
    // Match all pathnames except for
    // - … if they start with `/api`, `/_next` or `/_vercel`
    // - … the ones containing a dot (e.g. `favicon.ico`)
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
