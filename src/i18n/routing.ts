import { defineRouting } from 'next-intl/routing';
import { createNavigation } from 'next-intl/navigation';

export const routing = defineRouting({
  // A list of all locales that are supported
  locales: ['pt-BR', 'en-US'],

  // Used when no locale matches
  defaultLocale: 'pt-BR',

  // Never show /pt-BR in the URL for the default locale
  localePrefix: 'as-needed',

  // Disable automatic locale detection based on browser language
  localeDetection: false,
});

// Lightweight wrappers around Next.js' navigation APIs
// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter } =
  createNavigation(routing);
