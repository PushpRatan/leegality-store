# Products catalog

A Vite + React + TypeScript app that browses [DummyJSON](https://dummyjson.com/docs/products) products with URL-backed search, filters, sort, and pagination.

## Overview

- Shared header on every route, with a home link and a centered search bar.
- Search suggestions (top 5) as you type, with keyboard support, loading and empty states, and highlighted matches.
- Submit search with Enter to set `q` in the URL and keep other filters. Choosing a suggestion opens `/product/:id`.
- Listing filters: category, brand, min/max price, and minimum rating. All of these compose with search and sort.
- Sort: Relevance, Price low to high, Price high to low, Rating high to low (`sort` query param).
- Client-side pagination (`page`), with page reset when any filter, search, or sort changes.
- Product detail page with back navigation that preserves listing query params via browser history.
- Loading, error (with retry), and empty states throughout.

## Setup

```bash
npm install
npm run dev
```

Production build:

```bash
npm run build
npm run preview
```

Lint:

```bash
npm run lint
```

The dev server defaults to [http://localhost:5173](http://localhost:5173).

## Assumptions

- Product lists are fetched with `limit=0` so DummyJSON returns the full set; filtering, sorting, and pagination then happen on the client.
- The brand list is derived from the products returned by the current fetch (search results, or the category/all catalog).
- DummyJSON cannot combine search and category in one request. When `q` is set, the app calls `/products/search?q=` and applies category, brand, price, and rating on the client. Without `q`, category is requested from `/products/category/:slug`.
- Search suggestions use a separate `/products/search` request with `limit=5` and abort in-flight calls when the query changes.
- “Clear filters” resets category, brand, price, rating, and page. It does not clear `q`; that is only cleared from the search input’s × button.
- Relevance sort keeps the order returned by DummyJSON.

## Architectural decisions

- **Folders:** `api/` for HTTP, `hooks/` for data and URL state, `components/` for UI, `pages/` for routes, `types/` for DummyJSON models, `utils/` for pure helpers.
- **URL as source of truth:** `q`, `category`, `brands`, `minPrice`, `maxPrice`, `minRating`, `sort`, and `page` live in search params so refresh, share, and Back keep the same listing.
- **Custom hooks:** `useProductSearch`, `useProducts`, `useSearchSuggestions`, `useProductListParams`, and `useDebounce` keep fetch and param updates out of presentational components.
- **Pure utils:** `applyProductListFilters`, `filterByRating`, `sortProducts`, and `paginateItems` form a single pipeline: filter → sort → paginate.
- **API layer:** `src/api/productsApi.ts` is the only place that talks to DummyJSON; it throws on non-OK responses and accepts `AbortSignal`.

## Improvements with more time

- React Query (or similar) for caching, request deduping, and fewer refetches when toggling filters.
- Server-side pagination, sort, and combined filters if the backend supported them.
- Unit and integration tests for filter/sort helpers, URL parsing, and search keyboard behavior.
- Skeleton loaders instead of a single spinner.
- A dedicated mobile filter drawer instead of the collapse toggle.
