import { DesktopNav } from '@/components/DesktopNav';
import { FloatingActionButton } from '@/components/FloatingActionButton';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DesktopNav />
      {children}
      <FloatingActionButton />
    </>
  );
}
