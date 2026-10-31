import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react'
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { useDebounce } from '../hooks/useDebounce'
import { useSearchSuggestions } from '../hooks/useSearchSuggestions'
import { highlightText } from '../utils/highlight'
import { SEARCH_DEBOUNCE_MS, SUGGESTION_LIMIT } from '../utils/productFilters'
import { setOptionalParam } from '../utils/searchParams'
import { cx } from '../utils/styles'

function SearchBar() {
  const inputId = useId()
  const listboxId = useId()
  const containerRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()
  const location = useLocation()
  const [searchParams, setSearchParams] = useSearchParams()
  const urlQuery = searchParams.get('q') ?? ''
  const [draft, setDraft] = useState({ value: urlQuery, url: urlQuery })
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [indexedQuery, setIndexedQuery] = useState(urlQuery)

  if (urlQuery !== draft.url) {
    setDraft({ value: urlQuery, url: urlQuery })
  }

  const inputValue = draft.value
  const debouncedQuery = useDebounce(inputValue, SEARCH_DEBOUNCE_MS)
  const { data, loading, error } = useSearchSuggestions(debouncedQuery)
  const suggestions = data?.products.slice(0, SUGGESTION_LIMIT) ?? []
  const showDropdown = open && inputValue.trim().length > 0
  const activeSuggestion = activeIndex >= 0 ? suggestions[activeIndex] : undefined

  if (debouncedQuery !== indexedQuery) {
    setIndexedQuery(debouncedQuery)
    setActiveIndex(-1)
  }

  useEffect(() => {
    function handlePointerDown(event: MouseEvent) {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false)
        setActiveIndex(-1)
      }
    }

    document.addEventListener('mousedown', handlePointerDown)
    return () => document.removeEventListener('mousedown', handlePointerDown)
  }, [])

  function submitQuery(value: string) {
    const next = new URLSearchParams(searchParams)
    setOptionalParam(next, 'q', value.trim())
    next.delete('page')
    setOpen(false)
    setActiveIndex(-1)
    navigate({ pathname: '/', search: next.toString() ? `?${next.toString()}` : '' })
  }

  function goToProduct(id: number) {
    setOpen(false)
    setActiveIndex(-1)
    navigate(`/product/${id}`)
  }

  function clearQuery() {
    setDraft({ value: '', url: location.pathname === '/' ? '' : draft.url })
    setOpen(false)
    setActiveIndex(-1)

    if (location.pathname === '/') {
      setSearchParams((current) => {
        const next = new URLSearchParams(current)
        next.delete('q')
        next.delete('page')
        return next
      })
    }
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!showDropdown) {
        setOpen(true)
        return
      }

      setActiveIndex((current) => (current + 1) % Math.max(suggestions.length, 1))
      return
    }

    if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!showDropdown || suggestions.length === 0) {
        return
      }

      setActiveIndex((current) => (current <= 0 ? suggestions.length - 1 : current - 1))
      return
    }

    if (event.key === 'Enter') {
      event.preventDefault()
      if (activeSuggestion) {
        goToProduct(activeSuggestion.id)
        return
      }

      submitQuery(inputValue)
      return
    }

    if (event.key === 'Escape') {
      event.preventDefault()
      setOpen(false)
      setActiveIndex(-1)
    }
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-xl">
      <label htmlFor={inputId} className="sr-only">
        Search products
      </label>
      <div className="relative">
        <input
          id={inputId}
          type="text"
          role="combobox"
          autoComplete="off"
          spellCheck={false}
          placeholder="Search products"
          value={inputValue}
          onChange={(event) => {
            setDraft((current) => ({ ...current, value: event.target.value }))
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-expanded={showDropdown}
          aria-controls={listboxId}
          aria-autocomplete="list"
          aria-activedescendant={activeSuggestion ? `${listboxId}-${activeSuggestion.id}` : undefined}
          className="w-full rounded-full border border-slate-300 bg-slate-50 py-2 pr-10 pl-4 text-sm text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        />
        {inputValue ? (
          <button
            type="button"
            onClick={clearQuery}
            className="absolute top-1/2 right-2 -translate-y-1/2 rounded-full px-2 py-1 text-slate-500 hover:bg-slate-200 hover:text-slate-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            aria-label="Clear search"
          >
            ×
          </button>
        ) : null}
      </div>
      {showDropdown ? (
        <div
          id={listboxId}
          role="listbox"
          aria-label="Search suggestions"
          className="absolute z-50 mt-2 max-h-80 w-full overflow-y-auto rounded-xl border border-slate-200 bg-white py-2 shadow-lg"
        >
          {loading ? (
            <p className="px-4 py-3 text-sm text-slate-500" role="status">
              Searching
            </p>
          ) : null}
          {!loading && error ? (
            <p className="px-4 py-3 text-sm text-red-700" role="alert">
              {error}
            </p>
          ) : null}
          {!loading && !error && suggestions.length === 0 ? (
            <p className="px-4 py-3 text-sm text-slate-500" role="status">
              No results
            </p>
          ) : null}
          {!loading && !error
            ? suggestions.map((product, index) => (
                <button
                  key={product.id}
                  id={`${listboxId}-${product.id}`}
                  type="button"
                  role="option"
                  aria-selected={index === activeIndex}
                  onMouseDown={(event) => event.preventDefault()}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => goToProduct(product.id)}
                  className={cx(
                    'flex w-full items-center gap-3 px-4 py-2 text-left text-sm',
                    index === activeIndex ? 'bg-indigo-50' : 'hover:bg-slate-50',
                  )}
                >
                  <img
                    src={product.thumbnail}
                    alt=""
                    className="h-10 w-10 shrink-0 rounded-md object-cover"
                  />
                  <span className="line-clamp-2 text-slate-800">
                    {highlightText(product.title, debouncedQuery)}
                  </span>
                </button>
              ))
            : null}
        </div>
      ) : null}
    </div>
  )
}

export default SearchBar
