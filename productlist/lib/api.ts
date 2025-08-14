import { Product, ProductsResponse } from './types';

const BASE_URL = 'https://dummyjson.com';

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchApi<T>(endpoint: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${endpoint}`);
  
  if (!response.ok) {
    throw new ApiError(response.status, `Failed to fetch: ${response.statusText}`);
  }
  
  const data = await response.json();
  return data;
}

export async function fetchProducts(limit = 30, skip = 0): Promise<ProductsResponse> {
  return fetchApi<ProductsResponse>(`/products?limit=${limit}&skip=${skip}`);
}

export async function fetchProductById(id: string | number): Promise<Product> {
  return fetchApi<Product>(`/products/${id}`);
}

// Utility function to get all unique tags from products
export function getUniqueTags(products: Product[]): string[] {
  const tagSet = new Set<string>();
  products.forEach(product => {
    product.tags?.forEach(tag => tagSet.add(tag));
  });
  return Array.from(tagSet).sort();
}
