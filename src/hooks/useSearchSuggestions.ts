import { useCallback } from 'react'
import { searchProducts } from '../api/productsApi'
import type { ProductsResponse } from '../types/product'
import { SUGGESTION_LIMIT } from '../utils/productFilters'
import { useAsyncResource } from './useAsyncResource'

export function useSearchSuggestions(query: string) {
  const trimmedQuery = query.trim()
  const fetcher = useCallback(
    (signal: AbortSignal) => searchProducts(trimmedQuery, signal, SUGGESTION_LIMIT),
    [trimmedQuery],
  )

  return useAsyncResource<ProductsResponse>(fetcher, {
    enabled: trimmedQuery.length > 0,
  })
}