import { Review } from '@/lib/types';
import { formatRelativeDate, getInitials } from '@/lib/utils';
import StarRating from './StarRating';

interface ReviewsListProps {
  reviews: Review[];
}

export default function ReviewsList({ reviews }: ReviewsListProps) {
  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8">
        <div className="text-4xl mb-3">💭</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
        <p className="text-gray-500">Be the first to share your thoughts about this product.</p>
      </div>
    );
  }

  // Sort reviews by date (newest first)
  const sortedReviews = [...reviews].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-bold text-gray-900 mb-4">
        Customer Reviews ({reviews.length})
      </h3>
      
      {sortedReviews.map((review, index) => (
        <div key={index} className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-start gap-4">
            {/* Avatar */}
            <div className="flex-shrink-0">
              <div className="w-10 h-10 bg-blue-500 text-white rounded-full flex items-center justify-center font-medium text-sm">
                {getInitials(review.reviewerName)}
              </div>
            </div>
            
            {/* Review content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h4 className="font-medium text-gray-900">{review.reviewerName}</h4>
                <span className="text-gray-500">•</span>
                <time className="text-sm text-gray-500">
                  {formatRelativeDate(review.date)}
                </time>
              </div>
              
              <div className="mb-3">
                <StarRating rating={review.rating} size="sm" showValue />
              </div>
              
              <p className="text-gray-700 leading-relaxed">{review.comment}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
