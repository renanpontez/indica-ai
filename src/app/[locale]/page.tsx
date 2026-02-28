import Link from 'next/link';
import Image from 'next/image';
import { getTranslations } from 'next-intl/server';
import LandingNavbar from '@/components/LandingNavbar';
import HeroPhoneMockups from '@/components/HeroPhoneMockups';
import { routes, type Locale } from '@/lib/routes';
import { slugify } from '@/lib/utils/format';
import { createClient } from '@/lib/supabase/server';

interface LandingPageProps {
  params: Promise<{ locale: Locale }>;
}

// FAQ Accordion Client Component
function FAQAccordion({ questions }: { questions: { question: string; answer: string }[] }) {
  return (
    <div className="space-y-4">
      {questions.map((item, index) => (
        <details
          key={index}
          className="group bg-white rounded-2xl border border-divider overflow-hidden"
        >
          <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
            <span className="font-semibold text-dark-grey pr-4">{item.question}</span>
            <svg
              className="w-5 h-5 text-medium-grey transition-transform group-open:rotate-180 flex-shrink-0"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </summary>
          <div className="px-6 pb-6 text-medium-grey leading-relaxed">
            {item.answer}
          </div>
        </details>
      ))}
    </div>
  );
}

export default async function LandingPage({ params }: LandingPageProps) {
  const { locale } = await params;
  const t = await getTranslations('landing');
  const tExplore = await getTranslations('explore');
  const supabase = await createClient();

  // Fetch real stats from DB
  const [placesCountResult, citiesResult] = await Promise.all([
    supabase.from('places').select('*', { count: 'exact', head: true }),
    supabase.from('places').select('city'),
  ]);

  const placesCount = placesCountResult.count || 0;
  const uniqueCities = new Set(citiesResult.data?.map((p) => p.city) || []);
  const citiesCount = uniqueCities.size;

  // Fetch top cities by public experience count with a representative image
  const { data: cityExperiences } = await supabase
    .from('experiences')
    .select(`
      images,
      places:place_id (
        city,
        country
      )
    `)
    .eq('visibility', 'public')
    .eq('status', 'active');

  const cityMap = new Map<string, { name: string; country: string; count: number; image: string | null }>();
  (cityExperiences || []).forEach((exp: any) => {
    if (exp.places?.city) {
      const key = exp.places.city;
      const existing = cityMap.get(key);
      if (existing) {
        existing.count++;
        if (!existing.image && exp.images?.[0]) {
          existing.image = exp.images[0];
        }
      } else {
        cityMap.set(key, {
          name: exp.places.city,
          country: exp.places.country || '',
          count: 1,
          image: exp.images?.[0] || null,
        });
      }
    }
  });

  const featuredCities = Array.from(cityMap.values())
    .sort((a, b) => b.count - a.count)
    .slice(0, 4);

  const faqQuestions = [
    { question: t('faq.q1.question'), answer: t('faq.q1.answer') },
    { question: t('faq.q2.question'), answer: t('faq.q2.answer') },
    { question: t('faq.q3.question'), answer: t('faq.q3.answer') },
    { question: t('faq.q4.question'), answer: t('faq.q4.answer') },
    { question: t('faq.q5.question'), answer: t('faq.q5.answer') },
  ];

  return (
    <div className="min-h-screen bg-background">
      <LandingNavbar locale={locale} />

      {/* Hero Section - Phone Mockup Collage Style */}
      <section className="relative overflow-hidden bg-gradient-to-b from-white via-white to-gray-50">
        {/* Subtle background gradient blobs */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute -top-20 -right-20 w-96 h-96 rounded-full bg-primary/5 blur-3xl"/>
          <div className="absolute top-40 -left-20 w-80 h-80 rounded-full bg-primary/5 blur-3xl"/>
        </div>

        <div className="relative 2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-8">
          {/* Two-column layout: text left, phones right on desktop; stacked on mobile */}
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16 py-14 lg:py-20">

            {/* Left column: headline, subtitle, CTAs */}
            <div className="hero-text-animate flex-1 text-center lg:text-left max-w-xl mx-auto lg:mx-0">
              {/* Eyebrow badge */}
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-primary/10 rounded-full mb-5">
                <span className="w-1.5 h-1.5 rounded-full bg-primary"/>
                <span className="text-xs font-semibold text-primary uppercase tracking-wider">{t('hero.eyebrow')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-dark-grey mb-5 leading-tight">
                {t('hero.title')}
              </h1>
              <p className="text-base lg:text-lg text-medium-grey mb-8 leading-relaxed">
                {t('hero.subtitle')}
              </p>

              {/* Primary CTA */}
              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start mb-8">
                <Link
                  href={routes.auth.signup(locale)}
                  className="inline-flex items-center justify-center gap-2 px-7 py-3.5 bg-primary text-white rounded-full font-semibold text-base hover:bg-primary/90 transition-all hover:shadow-lg hover:scale-105"
                >
                  {t('nav.signUp')}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"/>
                  </svg>
                </Link>
                <Link
                  href={routes.auth.signin(locale)}
                  className="inline-flex items-center justify-center px-7 py-3.5 border border-divider text-dark-grey rounded-full font-semibold text-base hover:border-primary/40 hover:text-primary transition-all"
                >
                  {t('nav.login')}
                </Link>
              </div>

              {/* App Store badge */}
              <div className="flex flex-row gap-3 justify-center lg:justify-start flex-wrap">
                <a
                  href="#"
                  aria-label={t('hero.appStore.aria')}
                  className="inline-flex items-center gap-2.5 px-4 py-2.5 bg-dark-grey text-white rounded-xl hover:bg-dark-grey/90 transition-all hover:scale-105 hover:shadow-md"
                >
                  <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                  </svg>
                  <div className="flex flex-col leading-none">
                    <span className="text-[9px] font-normal opacity-80 uppercase tracking-wide">{t('hero.appStore.prefix')}</span>
                    <span className="text-sm font-semibold">App Store</span>
                  </div>
                  <span className="ml-1 px-1.5 py-0.5 bg-white/20 rounded text-[9px] font-semibold uppercase tracking-wide">{t('hero.appStore.soon')}</span>
                </a>
              </div>
            </div>

            {/* Right column: phone mockup collage */}
            <div className="flex-shrink-0 w-full lg:w-auto flex justify-center">
              <div className="relative w-[320px] sm:w-[380px] lg:w-[440px] h-[380px] sm:h-[440px] lg:h-[480px]">
                <HeroPhoneMockups />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Bar */}
      <section className="py-6 bg-white border-y border-divider">
        <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
          <div className="flex flex-wrap items-center justify-center gap-6 lg:gap-12 text-sm">
            <div className="flex items-center gap-2 text-medium-grey">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="font-medium">{t('trustBar.placesShared', { count: placesCount })}</span>
            </div>
            <div className="flex items-center gap-2 text-medium-grey">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-medium">{t('trustBar.inCities', { count: citiesCount })}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-primary/10 text-primary rounded-full font-medium text-xs">
                {t('trustBar.privateBeta')}
              </span>
            </div>
          </div>
        </div>
      </section>


      {/* How It Works Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
          <div className="text-center mb-12">
            <h2 className="text-2xl lg:text-3xl font-bold text-dark-grey mb-2">
              {t('howItWorks.title')}
            </h2>
            <p className="text-medium-grey">{t('howItWorks.subtitle')}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 lg:gap-12">
            {/* Step 1 */}
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-dark-grey mb-2">{t('howItWorks.step1.title')}</h3>
              <p className="text-medium-grey text-sm">{t('howItWorks.step1.description')}</p>
            </div>
            {/* Step 2 */}
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-dark-grey mb-2">{t('howItWorks.step2.title')}</h3>
              <p className="text-medium-grey text-sm">{t('howItWorks.step2.description')}</p>
            </div>
            {/* Step 3 */}
            <div className="text-center">
              <div className="mb-4">
                <svg className="w-12 h-12 mx-auto text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M17.593 3.322c1.1.128 1.907 1.077 1.907 2.185V21L12 17.25 4.5 21V5.507c0-1.108.806-2.057 1.907-2.185a48.507 48.507 0 0111.186 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-dark-grey mb-2">{t('howItWorks.step3.title')}</h3>
              <p className="text-medium-grey text-sm">{t('howItWorks.step3.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem-Agitation Section */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-dark-grey text-center mb-12">
            {t('problems.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Problem 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-divider text-center">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-red-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-dark-grey mb-2">{t('problems.problem1.title')}</h3>
              <p className="text-medium-grey text-sm">{t('problems.problem1.description')}</p>
            </div>
            {/* Problem 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-divider text-center">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-orange-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-orange-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-dark-grey mb-2">{t('problems.problem2.title')}</h3>
              <p className="text-medium-grey text-sm">{t('problems.problem2.description')}</p>
            </div>
            {/* Problem 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-divider text-center">
              <div className="w-14 h-14 mx-auto mb-6 rounded-full bg-purple-100 flex items-center justify-center">
                <svg className="w-7 h-7 text-purple-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-bold text-dark-grey mb-2">{t('problems.problem3.title')}</h3>
              <p className="text-medium-grey text-sm">{t('problems.problem3.description')}</p>
            </div>
          </div>
        </div>
      </section>


      {/* Featured Places Section (Improved) */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-dark-grey">
              {t('featured.title')}
            </h2>
            <Link
              href={routes.app.explore.index(locale)}
              className="px-4 py-2 bg-dark-grey text-white rounded-full text-sm font-semibold hover:bg-dark-grey/90 transition-colors"
            >
              {t('featured.exploreAll')}
            </Link>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {featuredCities.map((city) => (
              <Link
                key={city.name}
                href={routes.app.explore.city(locale, slugify(city.name))}
                className="group"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow">
                  {city.image ? (
                    <Image
                      src={city.image}
                      alt={city.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/80 to-primary/40 group-hover:scale-105 transition-transform duration-300" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <span className="text-white font-semibold text-lg block">
                      {city.name}
                    </span>
                    <span className="text-white/80 text-sm">
                      {city.count} {city.count === 1 ? tExplore('place') : tExplore('places')}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section (Improved About) */}
      <section className="py-16 lg:py-24 bg-surface">
        <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-dark-grey text-center mb-12">
            {t('benefits.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Benefit 1 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-divider">
              <div className="w-12 h-12 mb-6 rounded-xl bg-green-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-dark-grey mb-2">{t('benefits.benefit1.title')}</h3>
              <p className="text-medium-grey text-sm leading-relaxed">{t('benefits.benefit1.description')}</p>
            </div>
            {/* Benefit 2 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-divider">
              <div className="w-12 h-12 mb-6 rounded-xl bg-blue-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                </svg>
              </div>
              <h3 className="font-bold text-dark-grey mb-2">{t('benefits.benefit2.title')}</h3>
              <p className="text-medium-grey text-sm leading-relaxed">{t('benefits.benefit2.description')}</p>
            </div>
            {/* Benefit 3 */}
            <div className="bg-white rounded-2xl p-8 shadow-sm border border-divider">
              <div className="w-12 h-12 mb-6 rounded-xl bg-amber-100 flex items-center justify-center">
                <svg className="w-6 h-6 text-amber-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="font-bold text-dark-grey mb-2">{t('benefits.benefit3.title')}</h3>
              <p className="text-medium-grey text-sm leading-relaxed">{t('benefits.benefit3.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof / Use Cases Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-dark-grey text-center mb-12">
            {t('socialProof.title')}
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {/* Persona 1 - The Foodie */}
            <div className="relative bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-8 border border-orange-200">
              <div className="w-16 h-16 mb-6 rounded-full bg-orange-500 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="font-bold text-dark-grey text-xl mb-2">{t('socialProof.persona1.title')}</h3>
              <p className="text-medium-grey">{t('socialProof.persona1.description')}</p>
            </div>
            {/* Persona 2 - The Traveler */}
            <div className="relative bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-8 border border-blue-200">
              <div className="w-16 h-16 mb-6 rounded-full bg-blue-500 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-bold text-dark-grey text-xl mb-2">{t('socialProof.persona2.title')}</h3>
              <p className="text-medium-grey">{t('socialProof.persona2.description')}</p>
            </div>
            {/* Persona 3 - The Social Butterfly */}
            <div className="relative bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-8 border border-purple-200">
              <div className="w-16 h-16 mb-6 rounded-full bg-purple-500 flex items-center justify-center shadow-lg">
                <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </div>
              <h3 className="font-bold text-dark-grey text-xl mb-2">{t('socialProof.persona3.title')}</h3>
              <p className="text-medium-grey">{t('socialProof.persona3.description')}</p>
            </div>
          </div>
        </div>
      </section>


      {/* FAQ Section */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="2xl:max-w-[1440px] max-w-[800px] mx-auto px-6 lg:px-10">
          <h2 className="text-2xl lg:text-3xl font-bold text-dark-grey text-center mb-12">
            {t('faq.title')}
          </h2>
          <FAQAccordion questions={faqQuestions} />
        </div>
      </section>

      {/* Final CTA Section (Improved) */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="2xl:max-w-[1440px] max-w-[1000px] mx-auto px-6 lg:px-10">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              {t('finalCta.title')}
            </h2>
            <p className="text-white/80 mb-8 leading-relaxed">
              {t('finalCta.description')}
            </p>

            {/* Trust Signals */}
            <div className="flex items-center justify-center gap-6 mb-8 text-sm text-white/70">
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('finalCta.noCreditCard')}</span>
              </div>
              <div className="flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                <span>{t('finalCta.freeForever')}</span>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href={routes.auth.signup(locale)}
                className="inline-flex items-center px-8 py-4 bg-white text-primary rounded-full font-semibold text-lg hover:bg-white/90 transition-all hover:shadow-lg"
              >
                {t('finalCta.button')}
              </Link>
              <Link
                href={routes.app.explore.index(locale)}
                className="inline-flex items-center px-8 py-4 bg-white/10 text-white rounded-full font-semibold text-lg hover:bg-white/20 transition-all border border-white/30"
              >
                {t('finalCta.secondaryButton')}
              </Link>
            </div>
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
              <Link href={routes.legal.terms(locale)} className="hover:text-dark-grey transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href={routes.legal.privacy(locale)} className="hover:text-dark-grey transition-colors">
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
