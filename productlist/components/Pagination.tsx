interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ currentPage, totalPages, onPageChange, className = '' }: PaginationProps) {
  if (totalPages <= 1) return null;

  const getVisiblePages = () => {
    const delta = 2;
    const range = [];
    const rangeWithDots = [];

    for (let i = Math.max(2, currentPage - delta); 
         i <= Math.min(totalPages - 1, currentPage + delta); 
         i++) {
      range.push(i);
    }

    if (currentPage - delta > 2) {
      rangeWithDots.push(1, '...');
    } else {
      rangeWithDots.push(1);
    }

    rangeWithDots.push(...range);

    if (currentPage + delta < totalPages - 1) {
      rangeWithDots.push('...', totalPages);
    } else {
      rangeWithDots.push(totalPages);
    }

    return rangeWithDots;
  };

  const visiblePages = getVisiblePages();

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`} aria-label="Pagination">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2
          ${currentPage === 1
            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white border border-gray-200 shadow-sm hover:shadow-md transform hover:scale-105'
          }
        `}
        aria-label="Previous page"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Previous
      </button>

      {/* Page numbers */}
      {visiblePages.map((page, index) => (
        <span key={index}>
          {page === '...' ? (
            <span className="px-4 py-3 text-sm font-medium text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`
                px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 min-w-[44px]
                ${currentPage === page
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/25 transform scale-105'
                  : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white border border-gray-200 shadow-sm hover:shadow-md transform hover:scale-105'
                }
              `}
              aria-current={currentPage === page ? 'page' : undefined}
            >
              {page}
            </button>
          )}
        </span>
      ))}

      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`
          px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 flex items-center gap-2
          ${currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed bg-gray-50'
            : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900 bg-white border border-gray-200 shadow-sm hover:shadow-md transform hover:scale-105'
          }
        `}
        aria-label="Next page"
      >
        Next
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </nav>
  );
}
