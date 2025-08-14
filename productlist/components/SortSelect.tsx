import { SortOption } from '@/lib/types';

interface SortSelectProps {
  value: SortOption;
  onChange: (value: SortOption) => void;
}

export default function SortSelect({ value, onChange }: SortSelectProps) {
  const options: { value: SortOption; label: string }[] = [
    { value: 'all', label: 'All Products' },
    { value: 'price-asc', label: 'Price: Low to High' },
    { value: 'price-desc', label: 'Price: High to Low' },
    { value: 'rating-desc', label: 'Rating: High to Low' },
  ];

  return (
    <div className="flex items-center gap-3 min-w-fit">
      {/* <label htmlFor="sort-select" className="text-sm font-medium text-gray-700 whitespace-nowrap">
        Sort by:
      </label> */}
      <select
        id="sort-select"
        value={value}
        onChange={(e) => onChange(e.target.value as SortOption)}
        className="block px-4 py-3 text-sm font-medium text-gray-900 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer"
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
