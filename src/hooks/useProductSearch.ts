import { useCallback } from 'react'
import { searchProducts } from '../api/productsApi'
import type { ProductsResponse } from '../types/product'
import { useAsyncResource } from './useAsyncResource'

export function useProductSearch(query: string) {
  const trimmedQuery = query.trim()
  const fetcher = useCallback(
    (signal: AbortSignal) => searchProducts(trimmedQuery, signal),
    [trimmedQuery],
  )

  return useAsyncResource<ProductsResponse>(fetcher, {
    enabled: trimmedQuery.length > 0,
  })
}