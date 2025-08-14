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
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">
          Filter by categories:
        </label>
        {selectedTags.length > 0 && (
          <button
            type="button"
            onClick={clearAll}
            className="text-sm text-blue-600 hover:text-blue-800 font-medium hover:underline transition-colors duration-200"
          >
            Clear all ({selectedTags.length})
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
              px-4 py-2 text-sm font-medium rounded-xl border transition-all duration-200 transform hover:scale-105
              ${selectedTags.includes(tag)
                ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white border-blue-500 shadow-lg shadow-blue-500/25'
                : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100 hover:border-gray-300 hover:shadow-md'
              }
            `}
          >
            {tag}
          </button>
        ))}
      </div>
      
      {selectedTags.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 bg-blue-50 rounded-lg p-3 border border-blue-100">
          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z" />
          </svg>
          <span>
            <span className="font-semibold text-blue-700">{selectedTags.length}</span> categor{selectedTags.length === 1 ? 'y' : 'ies'} selected
          </span>
        </div>
      )}
    </div>
  );
}
