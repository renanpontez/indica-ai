import { Chip } from '@/components/Chip';
import type { PriceRange } from '@/lib/models';

interface PriceRangeSelectorProps {
  value: PriceRange | null;
  onChange: (value: PriceRange) => void;
  error?: string;
}

const priceRanges: PriceRange[] = ['$', '$$', '$$$', '$$$$'];

export function PriceRangeSelector({ value, onChange, error }: PriceRangeSelectorProps) {
  return (
    <div>
      <div className="flex gap-sm">
        {priceRanges.map((range) => (
          <Chip
            key={range}
            label={range}
            variant="price"
            active={value === range}
            onClick={() => onChange(range)}
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
