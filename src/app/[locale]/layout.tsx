import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { Providers } from '@/components/Providers';
import { getServerUser } from '@/lib/auth/getServerUser';

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  // Await params as it's now a Promise in Next.js 15+
  const { locale } = await params;

  // Validate that the incoming `locale` parameter is valid
  const validLocales = ['pt-BR', 'en-US'];
  if (!validLocales.includes(locale)) {
    notFound();
  }

  // Fetch messages and user data in parallel for optimal performance
  const [messages, initialUser] = await Promise.all([
    getMessages(),
    getServerUser(),
  ]);

  return (
    <NextIntlClientProvider messages={messages} locale={locale}>
      <Providers initialUser={initialUser}>
        <div className="min-h-screen">{children}</div>
      </Providers>
    </NextIntlClientProvider>
  );
}
