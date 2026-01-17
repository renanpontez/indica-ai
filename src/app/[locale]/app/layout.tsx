import { DesktopNav } from '@/components/DesktopNav';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DesktopNav />
      {children}
    </>
  );
}
