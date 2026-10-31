import { useMemo } from 'react'
import EmptyState from '../components/EmptyState'
import ErrorMessage from '../components/ErrorMessage'
import FilterPanel from '../components/FilterPanel'
import Loader from '../components/Loader'
import PageShell from '../components/PageShell'
import Pagination from '../components/Pagination'
import ProductCard from '../components/ProductCard'
import SortBar from '../components/SortBar'
import { useCategories } from '../hooks/useCategories'
import { useProductListParams } from '../hooks/useProductListParams'
import { useProductSearch } from '../hooks/useProductSearch'
import { useProducts } from '../hooks/useProducts'
import {
  applyProductListFilters,
  EMPTY_PRODUCTS,
  hasActiveFilters,
  PAGE_SIZE,
  paginateItems,
  sortProducts,
  uniqueBrands,
} from '../utils/productFilters'

function ProductListPage() {
  const {
    filters,
    setCategory,
    setPrice,
    setBrands,
    setMinRating,
    setSort,
    setPage,
    clearFilters,
  } = useProductListParams()
  const hasQuery = filters.q.trim().length > 0
  const {
    data: categories,
    loading: categoriesLoading,
    error: categoriesError,
    retry: retryCategories,
  } = useCategories()
  const search = useProductSearch(filters.q)
  const catalog = useProducts(filters.category || undefined, !hasQuery)
  const productsResponse = hasQuery ? search.data : catalog.data
  const productsLoading = hasQuery ? search.loading : catalog.loading
  const productsError = hasQuery ? search.error : catalog.error
  const products = productsResponse?.products ?? EMPTY_PRODUCTS
  const brandedSource = useMemo(
    () =>
      filters.category
        ? products.filter((product) => product.category === filters.category)
        : products,
    [filters.category, products],
  )
  const brands = useMemo(() => uniqueBrands(brandedSource), [brandedSource])
  const filteredProducts = useMemo(
    () => applyProductListFilters(products, filters),
    [filters, products],
  )
  const sortedProducts = useMemo(
    () => sortProducts(filteredProducts, filters.sort),
    [filteredProducts, filters.sort],
  )
  const totalPages = Math.max(1, Math.ceil(sortedProducts.length / PAGE_SIZE))
  const currentPage = Math.min(filters.page, totalPages)
  const pageProducts = useMemo(
    () => paginateItems(sortedProducts, currentPage, PAGE_SIZE),
    [currentPage, sortedProducts],
  )

  const loading = categoriesLoading || productsLoading
  const error = categoriesError || productsError

  function handleRetry() {
    if (categoriesError) {
      retryCategories()
    }

    if (productsError) {
      if (hasQuery) {
        search.retry()
        return
      }

      catalog.retry()
    }
  }

  const emptyMessage = hasQuery
    ? `No products match “${filters.q.trim()}” with the selected filters.`
    : 'No products match your filters.'

  return (
    <PageShell>
      <h1 className="text-3xl font-semibold text-slate-900">Products</h1>

      <div className="mt-6 grid gap-6 lg:grid-cols-[18rem_1fr]">
        <FilterPanel
          categories={categories ?? []}
          selectedCategory={filters.category}
          onCategoryChange={setCategory}
          minPrice={filters.minPrice}
          maxPrice={filters.maxPrice}
          onPriceChange={setPrice}
          brands={brands}
          selectedBrands={filters.brands}
          onBrandsChange={setBrands}
          minRating={filters.minRating}
          onMinRatingChange={setMinRating}
          canClear={hasActiveFilters(filters)}
          onClearFilters={clearFilters}
        />

        <section aria-label="Product results" aria-busy={loading}>
          {loading ? <Loader /> : null}
          {!loading && error ? <ErrorMessage message={error} onRetry={handleRetry} /> : null}
          {!loading && !error ? (
            <>
              <SortBar count={sortedProducts.length} sort={filters.sort} onSortChange={setSort} />
              {sortedProducts.length === 0 ? <EmptyState message={emptyMessage} /> : null}
              {pageProducts.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                    {pageProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                  <Pagination
                    page={currentPage}
                    totalPages={totalPages}
                    onPageChange={setPage}
                  />
                </>
              ) : null}
            </>
          ) : null}
        </section>
      </div>
    </PageShell>
  )
}

export default ProductListPage
