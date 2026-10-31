import { useCallback, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  clearFilterParams,
  parseProductListFilters,
  type ProductSort,
} from '../utils/productFilters'
import { setOptionalListParam, setOptionalParam } from '../utils/searchParams'

export function useProductListParams() {
  const [searchParams, setSearchParams] = useSearchParams()
  const filters = useMemo(() => parseProductListFilters(searchParams), [searchParams])

  const updateParams = useCallback(
    (mutate: (params: URLSearchParams) => void, resetPage: boolean) => {
      setSearchParams((current) => {
        const next = new URLSearchParams(current)
        mutate(next)

        if (resetPage) {
          next.delete('page')
        }

        return next
      })
    },
    [setSearchParams],
  )

  const setCategory = useCallback(
    (category: string) => {
      updateParams((params) => {
        setOptionalParam(params, 'category', category)
        params.delete('brands')
      }, true)
    },
    [updateParams],
  )

  const setPrice = useCallback(
    (minPrice: string, maxPrice: string) => {
      updateParams((params) => {
        setOptionalParam(params, 'minPrice', minPrice)
        setOptionalParam(params, 'maxPrice', maxPrice)
      }, true)
    },
    [updateParams],
  )

  const setBrands = useCallback(
    (brands: string[]) => {
      updateParams((params) => {
        setOptionalListParam(params, 'brands', brands)
      }, true)
    },
    [updateParams],
  )

  const setMinRating = useCallback(
    (minRating: number) => {
      updateParams((params) => {
        setOptionalParam(params, 'minRating', minRating ? String(minRating) : '')
      }, true)
    },
    [updateParams],
  )

  const setSort = useCallback(
    (sort: ProductSort) => {
      updateParams((params) => {
        setOptionalParam(params, 'sort', sort === 'relevance' ? '' : sort)
      }, true)
    },
    [updateParams],
  )

  const setPage = useCallback(
    (page: number) => {
      updateParams((params) => {
        setOptionalParam(params, 'page', page <= 1 ? '' : String(page))
      }, false)
    },
    [updateParams],
  )

  const clearFilters = useCallback(() => {
    updateParams((params) => {
      clearFilterParams(params)
    }, true)
  }, [updateParams])

  return {
    filters,
    setCategory,
    setPrice,
    setBrands,
    setMinRating,
    setSort,
    setPage,
    clearFilters,
  }
}