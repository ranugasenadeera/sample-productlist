import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils';
import StarRating from './StarRating';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const href = `/products/${encodeURIComponent(String(product.id))}`;
  
  return (
    <Link 
      href={href}
      className="group bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-gray-300 transition-all duration-300 overflow-hidden"
    >
      <div className="aspect-square relative bg-gradient-to-br from-gray-50 to-gray-100">
        <Image
          src={product.thumbnail || '/placeholder.svg'}
          alt={product.title}
          fill
          className="object-cover group-hover:scale-110 transition-transform duration-300"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        />
      </div>
      
      <div className="p-5">
        <h3 className="font-semibold text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors text-lg">
          {product.title}
        </h3>
        
        <div className="flex items-center gap-2 mb-3">
          <StarRating rating={product.rating} size="sm" />
          <span className="text-sm text-gray-500 font-medium">
            ({product.rating.toFixed(1)})
          </span>
        </div>
        
        <div className="text-xl font-bold text-gray-900 mb-4">
          {formatPrice(product.price)}
        </div>
        
        {product.tags && product.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {product.tags.slice(0, 3).map(tag => (
              <span
                key={tag}
                className="inline-block px-3 py-1 text-xs bg-blue-50 text-blue-700 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
            {product.tags.length > 3 && (
              <span className="inline-block px-3 py-1 text-xs bg-gray-100 text-gray-600 rounded-full font-medium">
                +{product.tags.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </Link>
  );
}
