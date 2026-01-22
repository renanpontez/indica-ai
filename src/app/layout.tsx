import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Script from 'next/script';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Circle Picks - Recommendations from people you trust',
  description: 'Discover places your friends love. Social recommendations from your trusted circle.',
  icons: {
    icon: '/assets/favicon.ico',
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
        <Script
          src="http://localhost:3001/widget.js?projectId=3607f5f9-35bb-4581-98fd-ef8e33cb9fd0"
          strategy="afterInteractive"
        />
      </body>
    </html>
  );
}
