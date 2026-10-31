import { isProductSort, SORT_OPTIONS, type ProductSort } from '../utils/productFilters'
import { fieldClass } from '../utils/styles'

type SortBarProps = {
  count: number
  sort: ProductSort
  onSortChange: (sort: ProductSort) => void
}

function SortBar({ count, sort, onSortChange }: SortBarProps) {
  return (
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-600" aria-live="polite">
        Showing {count} products
      </p>
      <div className="flex items-center gap-2">
        <label htmlFor="product-sort" className="text-sm font-medium text-slate-700">
          Sort
        </label>
        <select
          id="product-sort"
          value={sort}
          onChange={(event) => {
            if (isProductSort(event.target.value)) {
              onSortChange(event.target.value)
            }
          }}
          className={`${fieldClass} mt-0 w-auto min-w-52`}
        >
          {SORT_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  )
}

export default SortBar
