import { apiFetch } from './client';
import type { Product } from '../types/product';

export function fetchProducts() {
  return apiFetch<Product[]>('/products');
}

export function fetchProduct(sku: string) {
  return apiFetch<Product>(`/products/${encodeURIComponent(sku)}`);
}
