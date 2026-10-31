import { useCallback } from 'react'
import { getProducts, getProductsByCategory } from '../api/productsApi'
import type { ProductsResponse } from '../types/product'
import { useAsyncResource } from './useAsyncResource'

export function useProducts(category?: string, enabled = true) {
  const fetcher = useCallback(
    (signal: AbortSignal) =>
      category ? getProductsByCategory(category, signal) : getProducts(signal),
    [category],
  )

  return useAsyncResource<ProductsResponse>(fetcher, { enabled })
}