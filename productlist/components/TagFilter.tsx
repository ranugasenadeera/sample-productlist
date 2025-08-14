interface TagFilterProps {
  availableTags: string[];
  selectedTags: string[];
  onChange: (selectedTags: string[]) => void;
}

export default function TagFilter({ availableTags, selectedTags, onChange }: TagFilterProps) {
  const toggleTag = (tag: string) => {
    if (selectedTags.includes(tag)) {
      onChange(selectedTags.filter(t => t !== tag));
    } else {
      onChange([...selectedTags, tag]);
    }
  };

  const clearAll = () => {
    onChange([]);
  };

  if (availableTags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Filter by tags:
        </label>
        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-xs text-blue-600 hover:text-blue-800 font-medium"
          >
            Clear all
          </button>
        )}
      </div>
      
      <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
        {availableTags.map(tag => (
          <button
            key={tag}
            type="button"
            onClick={() => toggleTag(tag)}
            className={`
              px-3 py-1 text-xs rounded-full border transition-colors
              ${selectedTags.includes(tag)
                ? 'bg-blue-500 text-white border-blue-500'
                : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
              }
            `}
          >
            {tag}
          </button>
        ))}
      </div>
      
      {selectedTags.length > 0 && (
        <div className="text-xs text-gray-500">
          {selectedTags.length} tag{selectedTags.length === 1 ? '' : 's'} selected
        </div>
      )}
    </div>
  );
}
