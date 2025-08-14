export type Review = {
  rating: number;            // 1–5
  comment: string;
  date: string;              // ISO
  reviewerName: string;
  reviewerEmail: string;
};

export type Product = {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;            // 0–5
  tags?: string[];
  images?: string[];
  thumbnail?: string;
  reviews?: Review[];
};

export type ProductsResponse = {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
};

export type SortOption = 'all' | 'price-asc' | 'price-desc' | 'rating-desc';

export type FilterState = {
  search: string;
  tags: string[];
  sort: SortOption;
  page: number;
};
