import { getRequestConfig } from 'next-intl/server';

export default getRequestConfig(async ({ requestLocale }) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Provide a default locale if none is specified
  if (!locale) {
    locale = 'pt-BR';
  }

  return {
    locale,
    messages: (await import(`../locales/${locale}.json`)).default,
  };
});
