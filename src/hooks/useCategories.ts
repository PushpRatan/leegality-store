import { useCallback } from 'react'
import { getCategories } from '../api/productsApi'
import type { ProductCategory } from '../types/product'
import { useAsyncResource } from './useAsyncResource'

export function useCategories() {
  const fetcher = useCallback((signal: AbortSignal) => getCategories(signal), [])
  return useAsyncResource<ProductCategory[]>(fetcher)
}
