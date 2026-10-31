import type { Product } from '../types/product'

export const EMPTY_PRODUCTS: Product[] = []
export const PAGE_SIZE = 12
export const PRICE_DEBOUNCE_MS = 400
export const SEARCH_DEBOUNCE_MS = 300
export const SUGGESTION_LIMIT = 5

export type ProductSort = 'relevance' | 'price-asc' | 'price-desc' | 'rating-desc'

export type ProductListFilters = {
  q: string
  category: string
  minPrice: string
  maxPrice: string
  brands: string[]
  minRating: number
  sort: ProductSort
  page: number
}

export const SORT_OPTIONS: Array<{ value: ProductSort; label: string }> = [
  { value: 'relevance', label: 'Relevance' },
  { value: 'price-asc', label: 'Price: Low to High' },
  { value: 'price-desc', label: 'Price: High to Low' },
  { value: 'rating-desc', label: 'Rating: High to Low' },
]

export const RATING_OPTIONS: Array<{ value: number; label: string }> = [
  { value: 4, label: '4★ & up' },
  { value: 3, label: '3★ & up' },
  { value: 2, label: '2★ & up' },
  { value: 1, label: '1★ & up' },
  { value: 0, label: 'Any' },
]

const SORT_VALUES = new Set<string>(SORT_OPTIONS.map((option) => option.value))

function parsePage(value: string | null): number {
  const pageValue = Number(value ?? '1')
  return Number.isInteger(pageValue) && pageValue > 0 ? pageValue : 1
}

function parseMinRating(value: string | null): number {
  const rating = Number(value ?? '0')
  return Number.isInteger(rating) && rating >= 1 && rating <= 4 ? rating : 0
}

export function isProductSort(value: string): value is ProductSort {
  return SORT_VALUES.has(value)
}

function parseSort(value: string | null): ProductSort {
  if (value && isProductSort(value)) {
    return value
  }

  return 'relevance'
}

export function parseProductListFilters(
  searchParams: URLSearchParams,
): ProductListFilters {
  return {
    q: (searchParams.get('q') ?? '').trim(),
    category: searchParams.get('category') ?? '',
    minPrice: searchParams.get('minPrice') ?? '',
    maxPrice: searchParams.get('maxPrice') ?? '',
    brands: (searchParams.get('brands') ?? '')
      .split(',')
      .map((brand) => brand.trim())
      .filter(Boolean),
    minRating: parseMinRating(searchParams.get('minRating')),
    sort: parseSort(searchParams.get('sort')),
    page: parsePage(searchParams.get('page')),
  }
}

export function uniqueBrands(products: Product[]): string[] {
  return [...new Set(products.flatMap((product) => (product.brand ? [product.brand] : [])))].sort(
    (left, right) => left.localeCompare(right),
  )
}

export function filterByRating(products: Product[], minRating: number): Product[] {
  if (!minRating) {
    return products
  }

  return products.filter((product) => product.rating >= minRating)
}

export function applyProductListFilters(
  products: Product[],
  filters: ProductListFilters,
): Product[] {
  const minPrice = filters.minPrice === '' ? null : Number(filters.minPrice)
  const maxPrice = filters.maxPrice === '' ? null : Number(filters.maxPrice)
  const selectedBrands = new Set(filters.brands)

  const filtered = products.filter((product) => {
    if (filters.category && product.category !== filters.category) {
      return false
    }

    if (minPrice !== null && !Number.isNaN(minPrice) && product.price < minPrice) {
      return false
    }

    if (maxPrice !== null && !Number.isNaN(maxPrice) && product.price > maxPrice) {
      return false
    }

    if (selectedBrands.size > 0 && (!product.brand || !selectedBrands.has(product.brand))) {
      return false
    }

    return true
  })

  return filterByRating(filtered, filters.minRating)
}

export function sortProducts(products: Product[], sort: ProductSort): Product[] {
  if (sort === 'relevance') {
    return products
  }

  const sorted = [...products]

  if (sort === 'price-asc') {
    sorted.sort((left, right) => left.price - right.price)
  }

  if (sort === 'price-desc') {
    sorted.sort((left, right) => right.price - left.price)
  }

  if (sort === 'rating-desc') {
    sorted.sort((left, right) => right.rating - left.rating)
  }

  return sorted
}

export function paginateItems<T>(items: T[], page: number, pageSize: number): T[] {
  const start = (page - 1) * pageSize
  return items.slice(start, start + pageSize)
}

export function hasActiveFilters(filters: ProductListFilters): boolean {
  return Boolean(
    filters.category ||
      filters.minPrice ||
      filters.maxPrice ||
      filters.brands.length > 0 ||
      filters.minRating,
  )
}

export function clearFilterParams(params: URLSearchParams) {
  params.delete('category')
  params.delete('minPrice')
  params.delete('maxPrice')
  params.delete('brands')
  params.delete('minRating')
  params.delete('page')
}