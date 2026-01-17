'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useTranslations, useLocale } from 'next-intl';

export default function LandingPage() {
  const t = useTranslations('landing');
  const locale = useLocale();

  const categories = [
    { key: 'restaurants', icon: '🍽️' },
    { key: 'cafes', icon: '☕' },
    { key: 'bars', icon: '🍸' },
    { key: 'hotels', icon: '🏨' },
  ];

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
      {/* Navigation */}
      <nav className="sticky top-0 z-50 bg-white border-b border-divider">
        <div className="2xl:max-w-[1400px] max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between py-5">
            {/* Logo */}
            <Link href={`/${locale}`} className="flex items-center gap-2 flex-shrink-0">
              <Image
                src="/assets/indica-ai.svg"
                alt="indica aí logo"
                width={32}
                height={32}
                className="h-8 w-8"
              />
              <span className="text-xl font-bold text-primary hidden lg:block">
                indica aí
              </span>
            </Link>

            {/* Right Side Actions */}
            <div className="flex items-center gap-3 flex-shrink-0">
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
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1920&q=80"
            alt="Travel background"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-black/40" />
        </div>

        <div className="relative z-10">
          <div className="2xl:max-w-[1400px] max-w-[1200px] mx-auto px-6 lg:px-10 py-20 lg:py-32">
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl lg:text-5xl font-bold text-white mb-4">
                {t('hero.title')}
              </h1>
              <p className="text-lg text-white/90 mb-8">
                {t('hero.subtitle')}
              </p>

              {/* CTA Button */}
              <Link
                href={`/${locale}/auth/signup`}
                className="inline-flex items-center px-8 py-4 bg-primary text-white rounded-full font-semibold text-lg hover:bg-primary/90 transition-colors shadow-lg"
              >
                {t('nav.signUp')}
              </Link>
            </div>
          </div>

          {/* Category Icons */}
          <div className="2xl:max-w-[1400px] max-w-[1200px] mx-auto px-6 lg:px-10 pb-16">
            <div className="flex justify-center gap-6 lg:gap-12">
              {categories.map((category) => (
                <Link
                  key={category.key}
                  href={`/${locale}/explore?category=${category.key}`}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 lg:w-18 lg:h-18 rounded-full bg-white shadow-lg flex items-center justify-center text-xl lg:text-2xl group-hover:scale-105 transition-transform">
                    {category.icon}
                  </div>
                  <span className="text-sm font-medium text-white group-hover:text-white/80 transition-colors">
                    {t(`categories.${category.key}`)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section className="py-16 lg:py-24">
        <div className="2xl:max-w-[1400px] max-w-[1200px] mx-auto px-6 lg:px-10">
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
        <div className="2xl:max-w-[1400px] max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl lg:text-3xl font-bold text-dark-grey">
              {t('featured.title')}
            </h2>
            <Link
              href={`/${locale}/explore`}
              className="px-4 py-2 bg-text-primary text-white rounded-full text-sm font-semibold hover:bg-text-primary/90 transition-colors"
            >
              {t('featured.exploreAll')}
            </Link>
          </div>
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-6 px-6 lg:mx-0 lg:px-0 scrollbar-hide">
            {featuredPlaces.map((place) => (
              <Link
                key={place.id}
                href={`/${locale}/explore?city=${place.name}`}
                className="flex-shrink-0 w-48 lg:w-56 group"
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
      <section className="py-16 lg:py-24 bg-text-primary text-white">
        <div className="2xl:max-w-[1400px] max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-4">
                {t('cta.title')}
              </h2>
              <p className="text-white/80 mb-6 leading-relaxed">
                {t('cta.description')}
              </p>
              <Link
                href={`/${locale}/auth/signup`}
                className="inline-flex items-center px-6 py-3 bg-white text-dark-grey rounded-full font-semibold hover:bg-white/90 transition-colors"
              >
                {t('cta.button')}
              </Link>
            </div>
            <div className="hidden lg:flex justify-end">
              <div className="relative w-80 h-80">
                <div className="absolute top-0 right-0 w-48 h-64 rounded-2xl overflow-hidden transform rotate-6 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80"
                    alt="Restaurant"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="absolute bottom-0 left-0 w-48 h-64 rounded-2xl overflow-hidden transform -rotate-6 shadow-2xl">
                  <Image
                    src="https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=600&q=80"
                    alt="Cafe"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-surface">
        <div className="2xl:max-w-[1400px] max-w-[1200px] mx-auto px-6 lg:px-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <Image
                src="/assets/indica-ai.svg"
                alt="indica aí logo"
                width={24}
                height={24}
                className="h-6 w-6"
              />
              <span className="font-bold text-primary">indica aí</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-medium-grey">
              <Link href="#" className="hover:text-dark-grey transition-colors">
                {t('footer.terms')}
              </Link>
              <Link href="#" className="hover:text-dark-grey transition-colors">
                {t('footer.privacy')}
              </Link>
              <Link href="#" className="hover:text-dark-grey transition-colors">
                {t('footer.contact')}
              </Link>
            </div>
            <p className="text-sm text-medium-grey">
              © 2026 indica aí. {t('footer.rights')}
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
