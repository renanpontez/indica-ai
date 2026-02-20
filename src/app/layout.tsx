import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const ZAPBOLT_URL = process.env.NEXT_PUBLIC_ZAPBOLT_URL;
const UMAMI_WEBSITE_ID = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;
const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Circle Picks - Recommendations from people you trust',
  description: 'Discover places your friends love. Social recommendations from your trusted circle.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html suppressHydrationWarning>
      <body className={inter.className}>
        {children}
        {ZAPBOLT_URL && (
          <Script
            src={ZAPBOLT_URL}
            strategy="afterInteractive"
          />
        )}
        {UMAMI_WEBSITE_ID && (
          <Script
            defer
            src="https://cloud.umami.is/script.js"
            data-website-id={UMAMI_WEBSITE_ID}
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
