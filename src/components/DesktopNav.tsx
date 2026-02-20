import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SearchBar } from './SearchBar';
import { Avatar } from './Avatar';
import { NotificationBell } from '@/features/notifications/components/NotificationBell';
import type { AuthUser } from '@/lib/auth/AuthContext';
import { routes, type Locale } from '@/lib/routes';

interface DesktopNavProps {
  user: AuthUser | null;
}

export async function DesktopNav({ user }: DesktopNavProps) {
  const t = await getTranslations();
  const locale = await getLocale() as Locale;
  const isAuthenticated = !!user;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-divider">
      <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-4">
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <Link href={routes.app.feed(locale)} className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/assets/circle-picks.svg"
              alt="Circle Picks logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-primary">
              {t('nav.logo')}
            </span>
          </Link>

          {/* Search Bar - only visible for authenticated users */}
          {isAuthenticated && <SearchBar />}

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <LanguageSwitcher />

            {isAuthenticated && <NotificationBell />}

            {isAuthenticated && user.role === 'admin' && (
              <Link
                href={routes.app.admin.dashboard(locale)}
                className="px-3 py-1.5 text-sm font-medium text-medium-grey hover:text-dark-grey border border-divider rounded-lg transition-colors"
              >
                {t('admin.nav.experiences')}
              </Link>
            )}

            {isAuthenticated ? (
              <Link href={routes.app.profile.me(locale)}>
                <Avatar src={user.avatar_url} alt={user.display_name} size="sm" />
              </Link>
            ) : (
              <Link
                href={routes.auth.signup(locale)}
                className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
              >
                {t('nav.signUp')}
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
