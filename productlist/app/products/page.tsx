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
import SearchableDropdown from '@/components/SearchableDropdown';
import ShadcnPagination from '@/components/ShadcnPagination';

const PRODUCTS_PER_PAGE = 9;

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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="container mx-auto px-4 py-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent mb-6">Products</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse shadow-sm"></div>
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse shadow-sm"></div>
              <div className="h-12 bg-gradient-to-r from-gray-200 to-gray-300 rounded-xl animate-pulse shadow-sm"></div>
            </div>
          </div>
          <ProductGridSkeleton />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto border border-gray-100">
            <div className="text-red-500 text-6xl mb-4">⚠️</div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops! Something went wrong</h2>
            <div className="text-gray-600 mb-6">{error}</div>
            <button
              onClick={() => window.location.reload()}
              className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-transparent mb-4">
              Products
            </h1>
            <p className="text-gray-600 text-lg">Discover amazing products with great reviews</p>
          </div>
          
          {/* Filters Container */}
          <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6">
            {/* Search, Sort, and Category Filter in one row */}
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:gap-6 mb-4">
              <div className="flex-1 min-w-0">
                <SearchBar
                  value={search}
                  onChange={handleSearchChange}
                  placeholder="Search products..."
                />
              </div>
              <div className="w-full md:w-56">
                <SortSelect
                  value={sort}
                  onChange={handleSortChange}
                />
              </div>
              <div className="w-full md:w-72">
                <SearchableDropdown
                  availableOptions={availableTags}
                  selectedOptions={selectedTags}
                  onChange={handleTagsChange}
                  label="Filter by categories"
                  placeholder="Select categories..."
                  searchPlaceholder="Search categories..."
                />
              </div>
            </div>

            {/* Results info */}
            <div className="flex items-center justify-between text-sm border-t border-gray-100 pt-4">
              <span className="text-gray-600">
                Showing <span className="font-semibold text-gray-900">{paginatedProducts.length}</span> of{' '}
                <span className="font-semibold text-gray-900">{sortedProducts.length}</span> products
                {search && (
                  <span className="ml-1">
                    for "<span className="font-semibold text-blue-600">{search}</span>"
                  </span>
                )}
              </span>
              {selectedTags.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-gray-500">Categories:</span>
                  <div className="flex gap-1">
                    {selectedTags.slice(0, 2).map(tag => (
                      <span key={tag} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-200">
                        {tag}
                      </span>
                    ))}
                    {selectedTags.length > 2 && (
                      <span className="text-xs text-gray-500">+{selectedTags.length - 2} more</span>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {sortedProducts.length === 0 ? (
          <div className="text-center py-16">
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">🔍</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">No products found</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">
                Try adjusting your search terms or clearing some filters to discover more products.
              </p>
              <button
                onClick={() => updateURL({ search: '', tags: [], page: 1 })}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {/* Pagination */}
            <div className="flex justify-center">
              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-4">
                <ShadcnPagination
                  currentPage={page}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
