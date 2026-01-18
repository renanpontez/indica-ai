'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslations, useLocale } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { Avatar } from './Avatar';
import { LoadingSpinner } from './LoadingSpinner';

interface SearchResult {
  experiences: Array<{
    id: string;
    slug: string;
    brief_description: string | null;
    categories: string[];
    price_range: string | null;
    place: {
      id: string;
      name: string;
      city: string;
      country: string;
    } | null;
    user: {
      id: string;
      display_name: string;
      avatar_url: string | null;
    } | null;
  }>;
  users: Array<{
    id: string;
    display_name: string;
    username: string;
    avatar_url: string | null;
  }>;
}

export function SearchBar() {
  const t = useTranslations();
  const locale = useLocale();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult>({ experiences: [], users: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'experiences' | 'users'>('all');
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  const search = useCallback(async (searchQuery: string) => {
    if (searchQuery.length < 2) {
      setResults({ experiences: [], users: [] });
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}&type=${activeTab}`);
      if (response.ok) {
        const data = await response.json();
        setResults(data);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      search(query);
    }, 300);
    return () => clearTimeout(timeoutId);
  }, [query, search]);

  const handleExperienceClick = (experienceId: string, slug: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/${locale}/app/experience/${experienceId}/${slug}`);
  };

  const handleUserClick = (userId: string) => {
    setIsOpen(false);
    setQuery('');
    router.push(`/${locale}/app/profile/${userId}`);
  };

  const hasResults = results.experiences.length > 0 || results.users.length > 0;
  const showExperiences = activeTab === 'all' || activeTab === 'experiences';
  const showUsers = activeTab === 'all' || activeTab === 'users';

  return (
    <div ref={containerRef} className="hidden lg:flex items-center flex-1 justify-center max-w-2xl mx-8">
      <div className="relative w-full">
        {/* Search Input Bar */}
        <div
          className={cn(
            'flex items-center border border-divider rounded-full shadow-sm hover:shadow-md transition-shadow bg-white',
            isOpen && 'shadow-md'
          )}
        >
          <div className="flex-1 flex items-center">
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                if (!isOpen) setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              placeholder={t('nav.search.placeholder')}
              className="flex-1 px-6 py-3 bg-transparent text-sm text-dark-grey placeholder:text-medium-grey focus:outline-none"
            />
          </div>
          <button
            onClick={() => {
              if (query.length >= 2) {
                search(query);
              }
              setIsOpen(true);
              inputRef.current?.focus();
            }}
            className="flex items-center gap-2 bg-primary text-white rounded-full px-4 py-2 mr-2 hover:bg-primary/90 transition-colors"
          >
            <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-sm font-medium">{t('nav.search.searchButton')}</span>
          </button>
        </div>

        {/* Search Results Dropdown */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl shadow-lg border border-divider z-50 overflow-hidden">
            {/* Tabs */}
            <div className="flex border-b border-divider">
              <button
                onClick={() => setActiveTab('all')}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === 'all'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-medium-grey hover:text-dark-grey'
                )}
              >
                {t('nav.search.tabs.all')}
              </button>
              <button
                onClick={() => setActiveTab('experiences')}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === 'experiences'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-medium-grey hover:text-dark-grey'
                )}
              >
                {t('nav.search.tabs.experiences')}
              </button>
              <button
                onClick={() => setActiveTab('users')}
                className={cn(
                  'flex-1 px-4 py-3 text-sm font-medium transition-colors',
                  activeTab === 'users'
                    ? 'text-primary border-b-2 border-primary'
                    : 'text-medium-grey hover:text-dark-grey'
                )}
              >
                {t('nav.search.tabs.people')}
              </button>
            </div>

            {/* Results */}
            <div className="max-h-96 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <LoadingSpinner />
                </div>
              ) : query.length < 2 ? (
                <div className="px-4 py-8 text-center text-medium-grey text-sm">
                  {t('nav.search.hint')}
                </div>
              ) : !hasResults ? (
                <div className="px-4 py-8 text-center text-medium-grey text-sm">
                  {t('nav.search.noResults')}
                </div>
              ) : (
                <div className="py-2">
                  {/* Experiences Section */}
                  {showExperiences && results.experiences.length > 0 && (
                    <div>
                      {activeTab === 'all' && (
                        <div className="px-4 py-2 text-xs font-semibold text-medium-grey uppercase">
                          {t('nav.search.tabs.experiences')}
                        </div>
                      )}
                      {results.experiences.map((experience) => (
                        <button
                          key={experience.id}
                          onClick={() => handleExperienceClick(experience.id, experience.slug)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-surface transition-colors text-left"
                        >
                          <div className="h-10 w-10 rounded-lg bg-surface flex items-center justify-center flex-shrink-0">
                            <svg className="h-5 w-5 text-medium-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-dark-grey truncate">
                              {experience.place?.name || 'Unknown Place'}
                            </p>
                            <p className="text-xs text-medium-grey truncate">
                              {experience.place?.city}, {experience.place?.country}
                              {experience.user && ` • ${t('card.addedBy')} ${experience.user.display_name}`}
                            </p>
                          </div>
                          {experience.categories?.length > 0 && (
                            <span className="text-xs px-2 py-1 bg-surface rounded-full text-medium-grey">
                              {experience.categories[0]}
                            </span>
                          )}
                        </button>
                      ))}
                    </div>
                  )}

                  {/* Users Section */}
                  {showUsers && results.users.length > 0 && (
                    <div>
                      {activeTab === 'all' && (
                        <div className="px-4 py-2 text-xs font-semibold text-medium-grey uppercase">
                          {t('nav.search.tabs.people')}
                        </div>
                      )}
                      {results.users.map((user) => (
                        <button
                          key={user.id}
                          onClick={() => handleUserClick(user.id)}
                          className="w-full px-4 py-3 flex items-center gap-3 hover:bg-surface transition-colors text-left"
                        >
                          <Avatar src={user.avatar_url} alt={user.display_name} size="sm" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-dark-grey truncate">
                              {user.display_name}
                            </p>
                            <p className="text-xs text-medium-grey truncate">
                              @{user.username}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
