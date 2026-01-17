'use client';

import { usePathname } from 'next/navigation';
import { DesktopNav } from './DesktopNav';

export function LayoutContent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  // Check if we're on the landing page (root path with or without locale)
  const isLandingPage = pathname === '/' || /^\/[a-z]{2}-[A-Z]{2}\/?$/.test(pathname);

  return (
    <>
      {!isLandingPage && <DesktopNav />}
      <div className="min-h-screen">{children}</div>
    </>
  );
}
