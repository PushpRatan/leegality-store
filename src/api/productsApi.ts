import type { Product, ProductCategory, ProductsResponse } from '../types/product'

const PRODUCTS_BASE_URL = 'https://dummyjson.com'

async function requestJson<T>(path: string, signal?: AbortSignal): Promise<T> {
  const response = await fetch(`${PRODUCTS_BASE_URL}${path}`, { signal })

  if (!response.ok) {
    throw new Error(`Request failed for ${path}: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<T>
}

export function getProducts(signal?: AbortSignal): Promise<ProductsResponse> {
  return requestJson<ProductsResponse>('/products?limit=0', signal)
}

export function getCategories(signal?: AbortSignal): Promise<ProductCategory[]> {
  return requestJson<ProductCategory[]>('/products/categories', signal)
}

export function getProductsByCategory(
  category: string,
  signal?: AbortSignal,
): Promise<ProductsResponse> {
  return requestJson<ProductsResponse>(
    `/products/category/${encodeURIComponent(category)}?limit=0`,
    signal,
  )
}

export function getProductById(id: number, signal?: AbortSignal): Promise<Product> {
  return requestJson<Product>(`/products/${id}`, signal)
}

export function searchProducts(
  query: string,
  signal?: AbortSignal,
  limit = 0,
): Promise<ProductsResponse> {
  const params = new URLSearchParams({
    q: query,
    limit: String(limit),
  })

  return requestJson<ProductsResponse>(`/products/search?${params.toString()}`, signal)
}
