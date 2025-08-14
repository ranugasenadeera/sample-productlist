'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/lib/types';
import { fetchProductById, ApiError } from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import StarRating from '@/components/StarRating';
import ReviewsList from '@/components/ReviewsList';

export default function ProductDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  const productId = params.id as string;

  // Preserve URL params for back navigation
  const backUrl = searchParams.toString() 
    ? `/products?${searchParams.toString()}`
    : '/products';

  useEffect(() => {
    async function loadProduct() {
      try {
        setLoading(true);
        setError(null);
        
        const productData = await fetchProductById(productId);
        setProduct(productData);
      } catch (err) {
        if (err instanceof ApiError && err.status === 404) {
          setError('Product not found');
        } else {
          setError(err instanceof Error ? err.message : 'Failed to load product');
        }
      } finally {
        setLoading(false);
      }
    }

    if (productId) {
      loadProduct();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-200 rounded w-24 mb-6"></div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="aspect-square bg-gray-200 rounded-lg"></div>
              <div className="flex gap-2">
                {Array.from({ length: 4 }, (_, i) => (
                  <div key={i} className="w-16 h-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Link
          href={backUrl}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          ← Back to products
        </Link>
        
        <div className="text-center py-12">
          <div className="text-6xl mb-4">😕</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {error === 'Product not found' ? 'Product Not Found' : 'Error Loading Product'}
          </h1>
          <p className="text-gray-600 mb-6">
            {error === 'Product not found' 
              ? 'The product you\'re looking for doesn\'t exist or has been removed.'
              : error
            }
          </p>
          <div className="space-x-4">
            <Link
              href={backUrl}
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-md"
            >
              Back to Products
            </Link>
            {error !== 'Product not found' && (
              <button
                onClick={() => window.location.reload()}
                className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2 rounded-md"
              >
                Try Again
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (!product) return null;

  const images = product.images && product.images.length > 0 
    ? product.images.filter(Boolean) 
    : [product.thumbnail].filter(Boolean) as string[];

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Back button */}
      <Link
        href={backUrl}
        className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6 font-medium"
      >
        ← Back to products
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Image gallery */}
        <div className="space-y-4">
          <div className="aspect-square relative bg-gray-100 rounded-lg overflow-hidden">
            {images.length > 0 && (
              <Image
                src={images[selectedImageIndex]}
                alt={product.title}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
              />
            )}
          </div>
          
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`relative w-16 h-16 rounded border-2 overflow-hidden flex-shrink-0 ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                  }`}
                >
                  <Image
                    src={image}
                    alt={`${product.title} - Image ${index + 1}`}
                    fill
                    className="object-cover"
                    sizes="64px"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.title}</h1>
            
            <div className="flex items-center gap-4 mb-4">
              <StarRating rating={product.rating} size="md" showValue />
              {product.reviews && product.reviews.length > 0 && (
                <span className="text-sm text-gray-500">
                  ({product.reviews.length} review{product.reviews.length === 1 ? '' : 's'})
                </span>
              )}
            </div>
            
            <div className="text-3xl font-bold text-gray-900 mb-6">
              {formatPrice(product.price)}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-3">Description</h3>
            <p className="text-gray-700 leading-relaxed">{product.description}</p>
          </div>

          {product.tags && product.tags.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {product.tags.map(tag => (
                  <span
                    key={tag}
                    className="inline-block px-3 py-1 text-sm bg-blue-100 text-blue-800 rounded-full"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Reviews section */}
      <div className="border-t border-gray-200 pt-8">
        <ReviewsList reviews={product.reviews || []} />
      </div>
    </div>
  );
}
