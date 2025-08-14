import { Product, SortOption } from './types';

export function filterProducts(
  products: Product[],
  search: string,
  selectedTags: string[]
): Product[] {
  return products.filter(product => {
    // Search filter
    const matchesSearch = search.trim() === '' || 
      product.title.toLowerCase().includes(search.toLowerCase());
    
    // Tag filter
    const matchesTags = selectedTags.length === 0 || 
      selectedTags.every(tag => product.tags?.includes(tag));
    
    return matchesSearch && matchesTags;
  });
}

export function sortProducts(products: Product[], sortOption: SortOption): Product[] {
  return [...products].sort((a, b) => {
    switch (sortOption) {
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'rating-desc':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });
}

export function paginateProducts(products: Product[], page: number, perPage = 8): Product[] {
  const startIndex = (page - 1) * perPage;
  return products.slice(startIndex, startIndex + perPage);
}

export function getTotalPages(totalItems: number, perPage = 8): number {
  return Math.ceil(totalItems / perPage);
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
}

export function getInitials(name: string): string {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function formatRelativeDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInDays = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24));
  
  if (diffInDays === 0) return 'Today';
  if (diffInDays === 1) return 'Yesterday';
  if (diffInDays < 30) return `${diffInDays} days ago`;
  if (diffInDays < 365) return `${Math.floor(diffInDays / 30)} months ago`;
  return `${Math.floor(diffInDays / 365)} years ago`;
}
