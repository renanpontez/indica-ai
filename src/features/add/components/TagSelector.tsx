'use client';

import { useState, useRef, useMemo, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { cn } from '@/lib/utils/cn';
import { Chip } from '@/components/Chip';
import { useTags, useCreateTag } from '../hooks/useTags';
import type { Tag, TagWithLabel } from '@/lib/models';

interface TagSelectorProps {
  value: string[]; // Array of tag slugs
  onChange: (tags: string[]) => void;
  error?: string;
}

export function TagSelector({ value, onChange, error }: TagSelectorProps) {
  const t = useTranslations();
  const { data: tags, isLoading } = useTags();
  const { mutate: createTag, isPending: isCreating } = useCreateTag();

  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const justSelectedRef = useRef(false);

  // Resolve labels for tags
  const tagsWithLabels = useMemo((): TagWithLabel[] => {
    if (!tags) return [];
    return tags.map((tag: Tag) => ({
      ...tag,
      label: tag.display_name || tag.slug.charAt(0).toUpperCase() + tag.slug.slice(1).replace(/-/g, ' '),
    }));
  }, [tags]);

  // Get selected tags with labels
  const selectedTagsWithLabels = useMemo(() => {
    return value.map((slug) => {
      const tag = tagsWithLabels.find((t) => t.slug === slug);
      return tag || { slug, label: slug, id: slug, is_system: false, display_name: null, created_by: null, created_at: '' };
    });
  }, [value, tagsWithLabels]);

  // Filter and group available tags
  const { filteredTags, groupedTags, flatList } = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    const available = tagsWithLabels.filter((tag) => {
      // Don't show already selected tags
      if (value.includes(tag.slug)) return false;
      // Filter by search query
      if (!query) return true;
      return tag.label.toLowerCase().includes(query) || tag.slug.includes(query);
    });

    const system = available.filter((tag) => tag.is_system);
    const custom = available.filter((tag) => !tag.is_system);

    // Create flat list for keyboard navigation
    const flat: TagWithLabel[] = [...system, ...custom];

    return {
      filteredTags: available,
      groupedTags: { system, custom },
      flatList: flat,
    };
  }, [tagsWithLabels, searchQuery, value]);

  // Check if we should show the "Create tag" option
  const showCreateOption = useMemo(() => {
    const query = searchQuery.trim();
    if (!query) return false;
    // Don't show if exact match exists (case-insensitive via slug)
    const normalizedSlug = query.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const exists = tags?.some((tag: Tag) => tag.slug === normalizedSlug);
    return !exists;
  }, [searchQuery, tags]);

  // Total items for keyboard navigation
  const totalItems = flatList.length + (showCreateOption ? 1 : 0);

  // Click outside to close
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlight when search changes
  useEffect(() => {
    setHighlightedIndex(-1);
  }, [searchQuery]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && dropdownRef.current) {
      const items = dropdownRef.current.querySelectorAll('[data-tag-item]');
      const item = items[highlightedIndex] as HTMLElement;
      if (item) {
        item.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex]);

  const handleSelect = (tag: TagWithLabel) => {
    justSelectedRef.current = true;
    onChange([...value, tag.slug]);
    setSearchQuery('');
    setHighlightedIndex(-1);
    // Keep dropdown open for multi-select
    inputRef.current?.focus();
  };

  const handleRemove = (slug: string) => {
    onChange(value.filter((s) => s !== slug));
  };

  const handleCreateTag = () => {
    const trimmed = searchQuery.trim();
    if (!trimmed || isCreating) return;

    const normalizedSlug = trimmed.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    if (!normalizedSlug) return;

    // Check if already exists
    const existingTag = tags?.find((tag: Tag) => tag.slug === normalizedSlug);
    if (existingTag) {
      if (!value.includes(existingTag.slug)) {
        onChange([...value, existingTag.slug]);
      }
      setSearchQuery('');
      setHighlightedIndex(-1);
      return;
    }

    // Create new tag
    createTag(trimmed, {
      onSuccess: (newTag: Tag) => {
        onChange([...value, newTag.slug]);
        setSearchQuery('');
        setHighlightedIndex(-1);
        inputRef.current?.focus();
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) => Math.min(prev + 1, totalItems - 1));
        }
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex((prev) => Math.max(prev - 1, 0));
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < flatList.length) {
          handleSelect(flatList[highlightedIndex]);
        } else if (highlightedIndex === flatList.length && showCreateOption) {
          handleCreateTag();
        } else if (showCreateOption) {
          handleCreateTag();
        }
        break;
      case 'Escape':
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        break;
      case 'Backspace':
        if (searchQuery === '' && value.length > 0) {
          onChange(value.slice(0, -1));
        }
        break;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-[44px] px-3 py-2 rounded-surface border border-divider flex flex-wrap gap-2 items-center">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-7 w-16 bg-surface rounded-chip animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div ref={containerRef} className="relative">
      {/* Main input container */}
      <div
        className={cn(
          'min-h-[44px] px-3 py-2 rounded-surface border',
          'flex flex-wrap gap-2 items-center cursor-text',
          isOpen ? 'border-primary ring-2 ring-primary/20' : 'border-divider',
          error && 'border-red-500'
        )}
        onClick={() => inputRef.current?.focus()}
      >
        {/* Selected tags as chips */}
        {selectedTagsWithLabels.map((tag) => (
          <Chip
            key={tag.slug}
            label={tag.label}
            active
            onRemove={() => handleRemove(tag.slug)}
          />
        ))}

        {/* Search input */}
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (!isOpen) setIsOpen(true);
          }}
          onFocus={() => {
            if (!justSelectedRef.current) setIsOpen(true);
            justSelectedRef.current = false;
          }}
          onKeyDown={handleKeyDown}
          placeholder={value.length === 0 ? t('add.tagsInput.searchPlaceholder') : ''}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-body placeholder:text-medium-grey"
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-autocomplete="list"
        />
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div
          ref={dropdownRef}
          className="absolute z-10 w-full mt-1 bg-background border border-divider rounded-surface shadow-lg max-h-60 overflow-y-auto"
          role="listbox"
        >
          {filteredTags.length === 0 && !showCreateOption ? (
            <div className="px-3 py-3 text-small text-medium-grey">
              {value.length === tagsWithLabels.length
                ? t('add.tagsInput.allSelected')
                : t('add.tagsInput.noResults')}
            </div>
          ) : (
            <>
              {/* System tags group */}
              {groupedTags.system.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-medium-grey uppercase tracking-wide">
                    {t('add.tagsInput.popularTags')}
                  </div>
                  {groupedTags.system.map((tag, index) => (
                    <button
                      key={tag.id}
                      data-tag-item
                      onClick={() => handleSelect(tag)}
                      className={cn(
                        'w-full text-left px-3 py-2 text-body transition-colors',
                        highlightedIndex === index ? 'bg-surface' : 'hover:bg-surface'
                      )}
                      role="option"
                      aria-selected={highlightedIndex === index}
                    >
                      {tag.label}
                    </button>
                  ))}
                </div>
              )}

              {/* Custom tags group */}
              {groupedTags.custom.length > 0 && (
                <div>
                  <div className="px-3 py-2 text-xs font-semibold text-medium-grey uppercase tracking-wide border-t border-divider">
                    {t('add.tagsInput.yourTags')}
                  </div>
                  {groupedTags.custom.map((tag, index) => {
                    const actualIndex = groupedTags.system.length + index;
                    return (
                      <button
                        key={tag.id}
                        data-tag-item
                        onClick={() => handleSelect(tag)}
                        className={cn(
                          'w-full text-left px-3 py-2 text-body transition-colors',
                          highlightedIndex === actualIndex ? 'bg-surface' : 'hover:bg-surface'
                        )}
                        role="option"
                        aria-selected={highlightedIndex === actualIndex}
                      >
                        {tag.label}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Create new tag option */}
              {showCreateOption && (
                <button
                  data-tag-item
                  onClick={handleCreateTag}
                  disabled={isCreating}
                  className={cn(
                    'w-full text-left px-3 py-2 text-body transition-colors border-t border-divider',
                    highlightedIndex === flatList.length ? 'bg-surface' : 'hover:bg-surface',
                    isCreating && 'opacity-50 cursor-wait'
                  )}
                  role="option"
                  aria-selected={highlightedIndex === flatList.length}
                >
                  <span className="text-primary font-medium">
                    {isCreating ? '...' : '+'} {t('add.tagsInput.createTag', { tag: searchQuery.trim() })}
                  </span>
                </button>
              )}
            </>
          )}
        </div>
      )}

      {/* Error message */}
      {error && (
        <p className="mt-1.5 text-small text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
