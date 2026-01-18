'use client';

import { useTranslations } from 'next-intl';
import { useCallback } from 'react';

export function useTagLabel() {
  const t = useTranslations();

  const getTagLabel = useCallback(
    (slug: string): string => {
      // Try to get translation for system tags
      // For custom tags, the slug is returned as-is (formatted nicely)
      try {
        const translated = t(`tags.${slug}`);
        // If translation returns the key path, it means it wasn't found
        if (translated && !translated.startsWith('tags.')) {
          return translated;
        }
      } catch {
        // Translation not found, fall through to default formatting
      }

      // Return slug as-is for custom tags (capitalize first letter for display)
      return slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' ');
    },
    [t]
  );

  return { getTagLabel };
}
