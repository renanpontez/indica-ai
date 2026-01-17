import { DesktopNav } from '@/components/DesktopNav';

export default function ExploreLayout({
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
