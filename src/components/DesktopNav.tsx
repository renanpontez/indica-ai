import Link from 'next/link';
import { getTranslations, getLocale } from 'next-intl/server';
import Image from 'next/image';
import { LanguageSwitcher } from './LanguageSwitcher';
import { SearchBar } from './SearchBar';
import { UserDropdown } from './UserDropdown';
import type { AuthUser } from '@/lib/auth/AuthContext';

interface DesktopNavProps {
  user: AuthUser | null;
}

export async function DesktopNav({ user }: DesktopNavProps) {
  const t = await getTranslations();
  const locale = await getLocale();
  const isAuthenticated = !!user;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-divider">
      <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-4">
        <div className="flex items-center justify-between py-5">
          {/* Logo */}
          <Link href={`/${locale}/app`} className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/assets/indica-ai.svg"
              alt="Indica Aí logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-primary hidden lg:block">
              {t('nav.logo')}
            </span>
          </Link>

          {/* Search Bar - only visible for authenticated users */}
          {isAuthenticated && <SearchBar />}

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            <LanguageSwitcher />

            {isAuthenticated ? (
              <UserDropdown user={user} locale={locale} />
            ) : (
              <Link
                href={`/${locale}/auth/signup`}
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
