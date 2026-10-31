function Loader() {
  return (
    <div
      className="flex min-h-64 items-center justify-center"
      role="status"
      aria-live="polite"
      aria-busy="true"
    >
      <div
        className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-indigo-600"
        aria-hidden="true"
      />
      <span className="sr-only">Loading</span>
    </div>
  )
}

export default Loader
