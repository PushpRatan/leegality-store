import { useCallback } from 'react'
import { getProductById } from '../api/productsApi'
import type { Product } from '../types/product'
import { useAsyncResource } from './useAsyncResource'

export function useProduct(id: number | string | undefined) {
  const productId = Number(id)
  const isValid = id !== undefined && id !== '' && Number.isInteger(productId) && productId > 0

  const fetcher = useCallback(
    (signal: AbortSignal) => getProductById(productId, signal),
    [productId],
  )

  return useAsyncResource<Product>(fetcher, {
    enabled: isValid,
    disabledError: 'A valid product id is required',
  })
}
