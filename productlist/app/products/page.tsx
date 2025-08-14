'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Product } from '@/lib/types';
import { fetchProducts, getUniqueTags } from '@/lib/api';
import { filterProducts, sortProducts, paginateProducts, getTotalPages } from '@/lib/utils';
import ProductCard from '@/components/ProductCard';
import { ProductGridSkeleton } from '@/components/LoadingSkeletons';
import SearchBar from '@/components/SearchBar';
import SortSelect from '@/components/SortSelect';
import TagFilter from '@/components/TagFilter';
import Pagination from '@/components/Pagination';

const PRODUCTS_PER_PAGE = 8;

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  // State
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [availableTags, setAvailableTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get filters from URL params
  const search = searchParams.get('search') || '';
  const selectedTags = searchParams.get('tags')?.split(',').filter(Boolean) || [];
  const sort = (searchParams.get('sort') as any) || 'price-asc';
  const page = parseInt(searchParams.get('page') || '1', 10);

  // Update URL when filters change
  const updateURL = useCallback((newParams: Record<string, string | string[] | number>) => {
    const params = new URLSearchParams(searchParams);
    
    Object.entries(newParams).forEach(([key, value]) => {
      if (value === '' || value === null || value === undefined || 
          (Array.isArray(value) && value.length === 0)) {
        params.delete(key);
      } else if (Array.isArray(value)) {
        params.set(key, value.join(','));
      } else {
        params.set(key, String(value));
      }
    });
    
    // Reset to page 1 when filters change
    if (Object.keys(newParams).some(key => key !== 'page')) {
      params.set('page', '1');
    }
    
    router.push(`/products?${params.toString()}`);
  }, [router, searchParams]);

  // Fetch products on mount
  useEffect(() => {
    async function loadProducts() {
      try {
        setLoading(true);
        setError(null);
        
        // Fetch all products at once for client-side filtering
        const response = await fetchProducts(100);
        
        setAllProducts(response.products);
        setAvailableTags(getUniqueTags(response.products));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    }

    loadProducts();
  }, []);

  // Filter and paginate products
  const filteredProducts = filterProducts(allProducts, search, selectedTags);
  const sortedProducts = sortProducts(filteredProducts, sort);
  const paginatedProducts = paginateProducts(sortedProducts, page, PRODUCTS_PER_PAGE);
  const totalPages = getTotalPages(sortedProducts.length, PRODUCTS_PER_PAGE);

  // Handle filter changes
  const handleSearchChange = (newSearch: string) => {
    updateURL({ search: newSearch });
  };

  const handleSortChange = (newSort: string) => {
    updateURL({ sort: newSort });
  };

  const handleTagsChange = (newTags: string[]) => {
    updateURL({ tags: newTags });
  };

  const handlePageChange = (newPage: number) => {
    updateURL({ page: newPage });
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-6">Products</h1>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
          </div>
        </div>
        <ProductGridSkeleton />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Products</h1>
        
        {/* Filters */}
        <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2 lg:grid-cols-3">
          <div className="col-span-1 md:col-span-2 lg:col-span-2 flex gap-4">
            <SearchBar
              value={search}
              onChange={handleSearchChange}
              placeholder="Search products..."
            />
            <SortSelect
              value={sort}
              onChange={handleSortChange}
            />
          </div>
        </div>
        <div className="mb-6">
          <TagFilter
            availableTags={availableTags}
            selectedTags={selectedTags}
            onChange={handleTagsChange}
          />
        </div>

        {/* Results info */}
        <div className="text-sm text-gray-600 mb-4">
          Showing {paginatedProducts.length} of {sortedProducts.length} products
          {search && ` for "${search}"`}
          {selectedTags.length > 0 && ` with tags: ${selectedTags.join(', ')}`}
        </div>
      </div>

      {/* Products Grid */}
      {sortedProducts.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-medium text-gray-900 mb-2">No products found</h3>
          <p className="text-gray-500 mb-4">
            Try adjusting your search terms or clearing some filters.
          </p>
          <button
            onClick={() => updateURL({ search: '', tags: [], page: 1 })}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md"
          >
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
            className="mb-8"
          />
        </>
      )}
    </div>
  );
}
