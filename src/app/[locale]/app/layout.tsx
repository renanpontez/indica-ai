import { DesktopNav } from '@/components/DesktopNav';
import { FloatingActionButton } from '@/components/FloatingActionButton';
import { getServerUser } from '@/lib/auth/getServerUser';

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getServerUser();

  return (
    <>
      <DesktopNav user={user} />
      <main className="pb-20">{children}</main>
      <FloatingActionButton />
    </>
  );
}
