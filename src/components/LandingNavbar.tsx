'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations } from 'next-intl';
import { LanguageSwitcher } from './LanguageSwitcher';

interface LandingNavbarProps {
  locale: string;
  showActions?: boolean;
}

export default function LandingNavbar({ locale, showActions = true }: LandingNavbarProps) {
  const t = useTranslations('landing');

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-divider">
      <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
            <Image
              src="/assets/indica-ai.svg"
              alt="Indica Aí logo"
              width={32}
              height={32}
              className="h-8 w-8"
            />
            <span className="text-xl font-bold text-primary hidden lg:block">
              Indica Aí
            </span>
          </Link>

          {/* Right Side Actions */}
          <div className="flex items-center gap-3 flex-shrink-0">
            {showActions && (
              <>
                <Link
                  href={`/${locale}/auth/signin`}
                  className="px-4 py-2 text-sm font-semibold text-dark-grey hover:text-primary transition-colors"
                >
                  {t('nav.login')}
                </Link>
                <Link
                  href={`/${locale}/auth/signup`}
                  className="px-4 py-2 text-sm font-semibold text-white bg-primary hover:bg-primary/90 rounded-full transition-colors"
                >
                  {t('nav.signUp')}
                </Link>
              </>
            )}
            <LanguageSwitcher />
          </div>
        </div>
      </div>
    </nav>
  );
}
