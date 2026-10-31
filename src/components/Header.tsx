import { Link } from 'react-router-dom'
import SearchBar from './SearchBar'

function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:gap-6 md:px-8">
        <Link
          to="/"
          className="shrink-0 text-lg font-semibold text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Products
        </Link>
        <div className="flex w-full justify-center sm:flex-1">
          <SearchBar />
        </div>
      </div>
    </header>
  )
}

export default Header
