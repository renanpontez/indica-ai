import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import { createClient } from '@/lib/supabase/server';
import LandingNavbar from '@/components/LandingNavbar';
import AuthShowcasePanel, { type ShowcaseItem } from '@/components/AuthShowcasePanel';
import { routes, type Locale } from '@/lib/routes';

const SHOWCASE_EXPERIENCE_IDS = [
  '9b17509b-9b97-445e-82f8-13f23d4d5ea8',
  'ffe413bb-49fd-4fef-bb4d-726c1cafa239',
  '73ea0c28-0efc-483c-b279-146460e148c0',
];

interface AuthLayoutProps {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}

export default async function AuthLayout({ children, params }: AuthLayoutProps) {
  const { locale } = await params;
  const typedLocale = locale as Locale;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Allow authenticated users through if they're in a password recovery flow
  const cookieStore = await cookies();
  const isPasswordRecovery = cookieStore.get('password_recovery')?.value === 'true';

  if (user && !isPasswordRecovery) {
    redirect(routes.app.feed(typedLocale));
  }

  // Fetch showcase experiences for the right panel
  const { data: experiences } = await supabase
    .from('experiences')
    .select(`
      id,
      brief_description,
      images,
      users:user_id (
        display_name,
        avatar_url
      ),
      places:place_id (
        name,
        city,
        country
      )
    `)
    .in('id', SHOWCASE_EXPERIENCE_IDS)
    .eq('status', 'active');

  const showcaseItems: ShowcaseItem[] = (experiences || [])
    .filter((exp) => exp.images?.length && exp.places && exp.users)
    .map((exp) => {
      const userObj = exp.users as unknown as { display_name: string; avatar_url: string | null };
      const placeObj = exp.places as unknown as { name: string; city: string; country: string };
      return {
        id: exp.id,
        userName: userObj.display_name,
        userAvatar: userObj.avatar_url,
        placeName: placeObj.name,
        placeLocation: `${placeObj.city}, ${placeObj.country}`,
        quote: exp.brief_description || '',
        imageUrl: exp.images![0],
      };
    });

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <LandingNavbar locale={typedLocale} showActions={false} />
      <div className="flex flex-1">
        <main className="w-full lg:w-1/2 flex items-center justify-center px-6 py-8 overflow-y-auto">
          <div className="w-full max-w-md">
            {children}
          </div>
        </main>
        <div className="hidden lg:block lg:w-1/2 relative">
          <AuthShowcasePanel items={showcaseItems} />
        </div>
      </div>
    </div>
  );
}
