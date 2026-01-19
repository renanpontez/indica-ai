'use client';

import { useState, useMemo } from 'react';
import { useTranslations } from 'next-intl';
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

  const [isAddingCustom, setIsAddingCustom] = useState(false);
  const [customTagInput, setCustomTagInput] = useState('');

  // Resolve labels for tags - use display_name if available, otherwise format slug
  const tagsWithLabels = useMemo((): TagWithLabel[] => {
    if (!tags) return [];

    return tags.map((tag: Tag) => ({
      ...tag,
      label: tag.display_name || tag.slug.charAt(0).toUpperCase() + tag.slug.slice(1).replace(/-/g, ' '),
    }));
  }, [tags]);

  // Separate system and custom tags for display
  const systemTags = tagsWithLabels.filter((tag) => tag.is_system);
  const customTags = tagsWithLabels.filter((tag) => !tag.is_system);

  const toggleTag = (slug: string) => {
    if (value.includes(slug)) {
      onChange(value.filter((s) => s !== slug));
    } else {
      onChange([...value, slug]);
    }
  };

  const handleAddCustomTag = () => {
    const trimmed = customTagInput.trim();
    if (!trimmed) return;

    const normalizedSlug = trimmed
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^a-z0-9-]/g, '');

    if (!normalizedSlug) return;

    // Check if already exists in current tags (case-insensitive via slug)
    const existingTag = tags?.find((tag: Tag) => tag.slug === normalizedSlug);
    if (existingTag) {
      // Just select it if it exists
      if (!value.includes(existingTag.slug)) {
        onChange([...value, existingTag.slug]);
      }
      setCustomTagInput('');
      setIsAddingCustom(false);
      return;
    }

    // Create new tag - pass original input to preserve display_name
    createTag(trimmed, {
      onSuccess: (newTag: Tag) => {
        onChange([...value, newTag.slug]);
        setCustomTagInput('');
        setIsAddingCustom(false);
      },
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddCustomTag();
    } else if (e.key === 'Escape') {
      setIsAddingCustom(false);
      setCustomTagInput('');
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-sm">
        {/* Loading skeleton chips */}
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-8 w-20 bg-surface rounded-chip animate-pulse" />
        ))}
      </div>
    );
  }

  return (
    <div>
      <div className="flex flex-wrap gap-sm">
        {/* System tags */}
        {systemTags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.label}
            active={value.includes(tag.slug)}
            onClick={() => toggleTag(tag.slug)}
          />
        ))}

        {/* Custom tags */}
        {customTags.map((tag) => (
          <Chip
            key={tag.id}
            label={tag.label}
            active={value.includes(tag.slug)}
            onClick={() => toggleTag(tag.slug)}
            variant="outlined"
          />
        ))}

        {/* Add custom tag button/input */}
        {isAddingCustom ? (
          <div className="inline-flex items-center gap-1 bg-surface rounded-chip px-3 py-1.5">
            <input
              type="text"
              value={customTagInput}
              onChange={(e) => setCustomTagInput(e.target.value)}
              onKeyDown={handleKeyDown}
              onBlur={() => {
                if (!customTagInput.trim()) {
                  setIsAddingCustom(false);
                }
              }}
              placeholder={t('add.tagsInput.customPlaceholder')}
              className="bg-transparent border-none outline-none text-small w-24"
              autoFocus
              disabled={isCreating}
            />
            {isCreating ? (
              <span className="text-small text-medium-grey animate-pulse">...</span>
            ) : (
              <button
                onClick={handleAddCustomTag}
                className="text-primary text-small font-semibold px-1 hover:opacity-70 transition-opacity"
                disabled={!customTagInput.trim()}
              >
                +
              </button>
            )}
          </div>
        ) : (
          <button
            onClick={() => setIsAddingCustom(true)}
            className="inline-flex items-center gap-1 bg-surface text-medium-grey rounded-chip px-3 py-1.5 text-small hover:text-dark-grey transition-colors"
          >
            <span>+</span>
            <span>{t('add.tagsInput.addCustom')}</span>
          </button>
        )}
      </div>

      {error && (
        <p className="mt-1.5 text-small text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
