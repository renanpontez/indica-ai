'use client';

import { Chip } from '@/components/Chip';

interface CategorySelectorProps {
  value: string[];
  onChange: (categories: string[]) => void;
  error?: string;
}

// Common categories - in a real app, these might come from the API
const CATEGORIES = [
  'Restaurant',
  'Cafe',
  'Bar',
  'Nightlife',
  'Italian',
  'Mexican',
  'Japanese',
  'Chinese',
  'American',
  'Asian Fusion',
  'Seafood',
  'Vegetarian',
  'Vegan',
  'Fast Food',
  'Dessert',
  'Bakery',
  'Brunch',
];

export function CategorySelector({ value, onChange, error }: CategorySelectorProps) {
  const toggleCategory = (category: string) => {
    if (value.includes(category)) {
      onChange(value.filter((c) => c !== category));
    } else {
      onChange([...value, category]);
    }
  };

  return (
    <div>
      <div className="flex flex-wrap gap-sm">
        {CATEGORIES.map((category) => (
          <Chip
            key={category}
            label={category}
            active={value.includes(category)}
            onClick={() => toggleCategory(category)}
          />
        ))}
      </div>
      {error && (
        <p className="mt-1.5 text-small text-red-500" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}
