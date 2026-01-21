import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import LandingNavbar from '@/components/LandingNavbar';

interface LandingPageProps {
  params: Promise<{ locale: string }>;
}

// Activity cards with icons and colors
const activityCards = [
  {
    id: 'beach',
    color: 'bg-cyan-400',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707" />
      </svg>
    ),
  },
  {
    id: 'hotel',
    color: 'bg-amber-400',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    id: 'food',
    color: 'bg-orange-500',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
  },
  {
    id: 'bar',
    color: 'bg-purple-500',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
      </svg>
    ),
  },
  {
    id: 'cafe',
    color: 'bg-rose-400',
    icon: (
      <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
      </svg>
    ),
  },
];

// Fake people using Unsplash
const people = [
  {
    id: 1,
    name: 'Ana',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 2,
    name: 'Carlos',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 3,
    name: 'Julia',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
  },
  {
    id: 4,
    name: 'Pedro',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
  },
];

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params;
  const t = await getTranslations('landing');

  const featuredPlaces = [
    {
      id: 1,
      name: 'São Paulo',
      image: 'https://images.unsplash.com/photo-1543059080-f9b1272213d5?w=800&q=80',
    },
    {
      id: 2,
      name: 'Rio de Janeiro',
      image: 'https://images.unsplash.com/photo-1483729558449-99ef09a8c325?w=800&q=80',
    },
    {
      id: 3,
      name: 'Lisboa',
      image: 'https://images.unsplash.com/photo-1585208798174-6cedd86e019a?w=800&q=80',
    },
    {
      id: 4,
      name: 'Buenos Aires',
      image: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=800&q=80',
    },
  ];

  const aboutFeatures = [
    {
      key: 'feature1',
      image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=600&q=80',
    },
    {
      key: 'feature2',
      image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80',
    },
    {
      key: 'feature3',
      image: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&q=80',
    },
    {
      key: 'feature4',
      image: 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=600&q=80',
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar locale={locale} />

      {/* Hero Section - Floating Cards Style */}
      <section className="relative py-16 lg:py-24 lg:pt-0 overflow-hidden bg-gradient-to-b from-white to-gray-50">
        <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
          {/* Floating Cards Container */}
          <div className="relative h-[400px] lg:h-[400px] mb-12">
            {/* SVG Connection Lines */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 0 }}>
              <defs>
                <pattern id="dot-pattern" x="0" y="0" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="2" cy="2" r="1.5" fill="#E5E7EB" />
                </pattern>
              </defs>
              {/* Connection lines from center to cards */}
              <line x1="50%" y1="50%" x2="8%" y2="25%" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" className="hidden lg:block" />
              <line x1="50%" y1="50%" x2="25%" y2="70%" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" className="hidden lg:block" />
              <line x1="50%" y1="50%" x2="92%" y2="25%" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" className="hidden lg:block" />
              <line x1="50%" y1="50%" x2="85%" y2="65%" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" className="hidden lg:block" />
              <line x1="50%" y1="50%" x2="18%" y2="45%" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" className="hidden lg:block" />
              <line x1="50%" y1="50%" x2="82%" y2="40%" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" className="hidden lg:block" />
              <line x1="50%" y1="50%" x2="12%" y2="70%" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" className="hidden lg:block" />
              <line x1="50%" y1="50%" x2="75%" y2="80%" stroke="#E5E7EB" strokeWidth="2" strokeDasharray="4 4" className="hidden lg:block" />
            </svg>

            {/* Center Logo Card */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
              <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-3xl bg-gradient-to-br from-primary to-primary/80 shadow-xl flex items-center justify-center">
                <Image
                  src="/assets/circle-picks.svg"
                  alt="Circle Picks"
                  width={64}
                  height={64}
                  className="w-12 h-12 lg:w-16 lg:h-16 brightness-0 invert"
                />
              </div>
            </div>

            {/* Person 1 - Top Left */}
            <div className="absolute left-[2%] lg:left-[5%] top-[15%] lg:top-[20%] z-10 animate-float-slow">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                <Image
                  src={people[0].image}
                  alt={people[0].name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Activity Card - Beach (Top Left Area) */}
            <div className="absolute left-[15%] lg:left-[18%] top-[40%] lg:top-[40%] z-10 animate-float">
              <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl ${activityCards[0].color} shadow-lg flex items-center justify-center`}>
                {activityCards[0].icon}
              </div>
            </div>

            {/* Person 2 - Bottom Left */}
            <div className="absolute left-[5%] lg:left-[10%] bottom-[15%] lg:bottom-[20%] z-10 animate-float-delayed">
              <div className="w-14 h-14 lg:w-18 lg:h-18 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                <Image
                  src={people[1].image}
                  alt={people[1].name}
                  width={72}
                  height={72}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Activity Card - Hotel (Top Right) */}
            <div className="absolute right-[15%] lg:right-[18%] top-[15%] lg:top-[18%] z-10 animate-float">
              <div className={`w-12 h-12 lg:w-14 lg:h-14 rounded-xl ${activityCards[1].color} shadow-lg flex items-center justify-center`}>
                {activityCards[1].icon}
              </div>
            </div>

            {/* Activity Card - Food (Top Right Area) */}
            <div className="absolute right-[2%] lg:right-[5%] top-[20%] lg:top-[22%] z-10 animate-float-slow">
              <div className={`w-14 h-14 lg:w-16 lg:h-16 rounded-xl ${activityCards[2].color} shadow-lg flex items-center justify-center`}>
                {activityCards[2].icon}
              </div>
            </div>

            {/* Person 3 - Right Middle */}
            <div className="absolute right-[8%] lg:right-[12%] top-[55%] lg:top-[55%] z-10 animate-float-delayed">
              <div className="w-16 h-16 lg:w-20 lg:h-20 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                <Image
                  src={people[2].image}
                  alt={people[2].name}
                  width={80}
                  height={80}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Activity Card - Bar (Right Bottom) */}
            <div className="absolute right-[20%] lg:right-[25%] bottom-[10%] lg:bottom-[12%] z-10 animate-float">
              <div className={`w-11 h-11 lg:w-12 lg:h-12 rounded-xl ${activityCards[3].color} shadow-lg flex items-center justify-center`}>
                {activityCards[3].icon}
              </div>
            </div>

            {/* Person 4 - Bottom Left Area */}
            <div className="absolute left-[22%] lg:left-[25%] bottom-[5%] lg:bottom-[8%] z-10 animate-float-slow">
              <div className="w-14 h-14 lg:w-16 lg:h-16 rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                <Image
                  src={people[3].image}
                  alt={people[3].name}
                  width={64}
                  height={64}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>

            {/* Activity Card - Cafe (Far Right) */}
            <div className="absolute right-[0%] lg:right-[2%] top-[45%] lg:top-[45%] z-10 animate-float-delayed">
              <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-xl bg-white shadow-lg border border-gray-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
              </div>
            </div>
          </div>

          {/* Hero Text */}
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl lg:text-5xl font-bold text-dark-grey mb-4 leading-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg text-medium-grey mb-8 leading-relaxed">
              {t('hero.subtitle')}
            </p>

            {/* CTA Button */}
            <Link
              href={`/${locale}/auth/signup`}
              className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary/90 transition-all hover:shadow-lg hover:scale-105"
            >
              {t('nav.signUp')}
            </Link>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 lg:py-24">
        <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-dark-grey mb-4">
                {t('about.title')}
              </h2>
              <p className="text-medium-grey mb-6 leading-relaxed">
                {t('about.description')}
              </p>
              <Link
                href={`/${locale}/auth/signup`}
                className="inline-flex items-center px-6 py-3 bg-primary text-white rounded-full font-semibold hover:bg-primary/90 transition-colors"
              >
                {t('about.cta')}
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src={aboutFeatures[0].image}
                    alt={t(`about.${aboutFeatures[0].key}`)}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white font-semibold">
                    {t(`about.${aboutFeatures[0].key}`)}
                  </span>
                </div>
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={aboutFeatures[1].image}
                    alt={t(`about.${aboutFeatures[1].key}`)}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white font-semibold">
                    {t(`about.${aboutFeatures[1].key}`)}
                  </span>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={aboutFeatures[2].image}
                    alt={t(`about.${aboutFeatures[2].key}`)}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white font-semibold">
                    {t(`about.${aboutFeatures[2].key}`)}
                  </span>
                </div>
                <div className="relative aspect-square rounded-2xl overflow-hidden">
                  <Image
                    src={aboutFeatures[3].image}
                    alt={t(`about.${aboutFeatures[3].key}`)}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white font-semibold">
                    {t(`about.${aboutFeatures[3].key}`)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Featured Places Section */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-dark-grey">
              {t('featured.title')}
            </h2>
            <Link
              href={`/${locale}/explore`}
              className="px-4 py-2 bg-dark-grey text-white rounded-full text-sm font-semibold hover:bg-dark-grey/90 transition-colors"
            >
              {t('featured.exploreAll')}
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredPlaces.map((place) => (
              <Link
                key={place.id}
                href={`/${locale}/explore?city=${place.name}`}
                className="group"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={place.image}
                    alt={place.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute bottom-4 left-4 text-white font-semibold text-lg">
                    {place.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t('cta.title')}
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              {t('cta.description')}
            </p>
            <Link
              href={`/${locale}/auth/signup`}
              className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:shadow-lg"
            >
              {t('cta.button')}
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-divider">
        <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/circle-picks.svg"
                alt="Circle Picks logo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="font-bold text-primary">Circle Picks</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-medium-grey">
              <Link href={`/${locale}/legal/terms`} className="hover:text-dark-grey transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href={`/${locale}/legal/privacy`} className="hover:text-dark-grey transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link href="mailto:contact@circlepicks.app" className="hover:text-dark-grey transition-colors">
                {t('footer.contact')}
              </Link>
            </div>
            <p className="text-sm text-medium-grey">
              © 2026 Circle Picks. {t('footer.rights')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
