import { useEffect, useId, useState } from 'react'
import { useDebounce } from '../hooks/useDebounce'
import type { ProductCategory } from '../types/product'
import { PRICE_DEBOUNCE_MS, RATING_OPTIONS } from '../utils/productFilters'
import { cx, fieldClass, outlineButtonClass, panelClass, radioOptionClass } from '../utils/styles'

type FilterPanelProps = {
  categories: ProductCategory[]
  selectedCategory: string
  onCategoryChange: (category: string) => void
  minPrice: string
  maxPrice: string
  onPriceChange: (minPrice: string, maxPrice: string) => void
  brands: string[]
  selectedBrands: string[]
  onBrandsChange: (brands: string[]) => void
  minRating: number
  onMinRatingChange: (minRating: number) => void
  canClear: boolean
  onClearFilters: () => void
}

function FilterPanel({
  categories,
  selectedCategory,
  onCategoryChange,
  minPrice,
  maxPrice,
  onPriceChange,
  brands,
  selectedBrands,
  onBrandsChange,
  minRating,
  onMinRatingChange,
  canClear,
  onClearFilters,
}: FilterPanelProps) {
  const headingId = useId()
  const fieldsId = useId()
  const [filtersOpen, setFiltersOpen] = useState(false)
  const [priceDraft, setPriceDraft] = useState({
    min: minPrice,
    max: maxPrice,
    urlMin: minPrice,
    urlMax: maxPrice,
  })

  if (minPrice !== priceDraft.urlMin || maxPrice !== priceDraft.urlMax) {
    setPriceDraft({ min: minPrice, max: maxPrice, urlMin: minPrice, urlMax: maxPrice })
  }

  const minInput = priceDraft.min
  const maxInput = priceDraft.max
  const debouncedMin = useDebounce(minInput, PRICE_DEBOUNCE_MS)
  const debouncedMax = useDebounce(maxInput, PRICE_DEBOUNCE_MS)
  const categoryOptions = [{ slug: '', name: 'All categories' }, ...categories]

  useEffect(() => {
    if (debouncedMin === minPrice && debouncedMax === maxPrice) {
      return
    }

    onPriceChange(debouncedMin, debouncedMax)
  }, [debouncedMax, debouncedMin, maxPrice, minPrice, onPriceChange])

  function toggleBrand(brand: string) {
    if (selectedBrands.includes(brand)) {
      onBrandsChange(selectedBrands.filter((item) => item !== brand))
      return
    }

    onBrandsChange([...selectedBrands, brand])
  }

  return (
    <aside className={panelClass} aria-labelledby={headingId}>
      <div className="flex items-center justify-between gap-3">
        <h2 id={headingId} className="text-lg font-semibold text-slate-900">
          Filters
        </h2>
        <button
          type="button"
          className={cx(outlineButtonClass, 'lg:hidden')}
          aria-expanded={filtersOpen}
          aria-controls={fieldsId}
          onClick={() => setFiltersOpen((open) => !open)}
        >
          {filtersOpen ? 'Hide filters' : 'Show filters'}
        </button>
      </div>

      <div id={fieldsId} className={cx('mt-4 space-y-6', filtersOpen ? 'block' : 'hidden', 'lg:block')}>
        <div>
          <label htmlFor="category-select" className="text-sm font-medium text-slate-700 lg:hidden">
            Category
          </label>
          <select
            id="category-select"
            value={selectedCategory}
            onChange={(event) => onCategoryChange(event.target.value)}
            className={cx(fieldClass, 'lg:hidden')}
            aria-label="Category"
          >
            {categoryOptions.map((category) => (
              <option key={category.slug || 'all'} value={category.slug}>
                {category.name}
              </option>
            ))}
          </select>
          <div
            role="radiogroup"
            aria-label="Category"
            className="hidden max-h-56 space-y-1 overflow-y-auto lg:block"
          >
            <p className="mb-2 text-sm font-medium text-slate-700">Category</p>
            {categoryOptions.map((category) => (
              <button
                key={category.slug || 'all'}
                type="button"
                role="radio"
                aria-checked={selectedCategory === category.slug}
                onClick={() => onCategoryChange(category.slug)}
                className={radioOptionClass(selectedCategory === category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-slate-700">Price</legend>
          <div className="mt-2 grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="min-price" className="text-sm text-slate-600">
                Min
              </label>
              <input
                id="min-price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={minInput}
                onChange={(event) =>
                  setPriceDraft((current) => ({ ...current, min: event.target.value }))
                }
                placeholder="0"
                aria-label="Minimum price"
                className={fieldClass}
              />
            </div>
            <div>
              <label htmlFor="max-price" className="text-sm text-slate-600">
                Max
              </label>
              <input
                id="max-price"
                type="number"
                inputMode="decimal"
                min="0"
                step="0.01"
                value={maxInput}
                onChange={(event) =>
                  setPriceDraft((current) => ({ ...current, max: event.target.value }))
                }
                placeholder="Any"
                aria-label="Maximum price"
                className={fieldClass}
              />
            </div>
          </div>
        </fieldset>

        <div role="radiogroup" aria-label="Rating">
          <p className="mb-2 text-sm font-medium text-slate-700">Rating</p>
          {RATING_OPTIONS.map((option) => (
            <button
              key={option.value}
              type="button"
              role="radio"
              aria-checked={minRating === option.value}
              onClick={() => onMinRatingChange(option.value)}
              className={radioOptionClass(minRating === option.value)}
            >
              {option.label}
            </button>
          ))}
        </div>

        <fieldset>
          <legend className="text-sm font-medium text-slate-700">Brand</legend>
          {brands.length === 0 ? (
            <p className="mt-2 text-sm text-slate-500">No brands available</p>
          ) : (
            <ul className="mt-2 max-h-64 space-y-2 overflow-y-auto">
              {brands.map((brand) => (
                <li key={brand}>
                  <label className="flex cursor-pointer items-center gap-2 text-sm text-slate-700">
                    <input
                      type="checkbox"
                      checked={selectedBrands.includes(brand)}
                      onChange={() => toggleBrand(brand)}
                      className="h-4 w-4 rounded border-slate-300 text-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    />
                    {brand}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </fieldset>

        <button
          type="button"
          onClick={onClearFilters}
          disabled={!canClear}
          className={cx(outlineButtonClass, 'w-full')}
        >
          Clear filters
        </button>
      </div>
    </aside>
  )
}

export default FilterPanel
