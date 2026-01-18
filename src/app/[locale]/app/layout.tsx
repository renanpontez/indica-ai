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
      <main className="pb-20">{children}</main>
      <FloatingActionButton />
    </>
  );
}
