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
    <nav className={`flex items-center justify-center space-x-1 ${className}`} aria-label="Pagination">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`
          px-3 py-2 text-sm font-medium rounded-md
          ${currentPage === 1
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
        aria-label="Previous page"
      >
        ← Previous
      </button>

      {/* Page numbers */}
      {visiblePages.map((page, index) => (
        <span key={index}>
          {page === '...' ? (
            <span className="px-3 py-2 text-sm font-medium text-gray-500">...</span>
          ) : (
            <button
              onClick={() => onPageChange(page as number)}
              className={`
                px-3 py-2 text-sm font-medium rounded-md
                ${currentPage === page
                  ? 'bg-blue-500 text-white'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
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
          px-3 py-2 text-sm font-medium rounded-md
          ${currentPage === totalPages
            ? 'text-gray-400 cursor-not-allowed'
            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
          }
        `}
        aria-label="Next page"
      >
        Next →
      </button>
    </nav>
  );
}
