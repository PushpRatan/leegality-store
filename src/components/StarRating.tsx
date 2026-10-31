type StarRatingProps = {
  rating: number
  decorative?: boolean
}

function StarRating({ rating, decorative = false }: StarRatingProps) {
  const clamped = Math.min(5, Math.max(0, rating))
  const rounded = Math.round(clamped)
  const label = `${clamped.toFixed(2)} out of 5 stars`

  return (
    <div
      className="flex items-center gap-1"
      role={decorative ? undefined : 'img'}
      aria-hidden={decorative ? true : undefined}
      aria-label={decorative ? undefined : label}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={index < rounded ? 'text-amber-500' : 'text-slate-300'}
          aria-hidden="true"
        >
          ★
        </span>
      ))}
      <span className="text-sm text-slate-600" aria-hidden="true">
        {clamped.toFixed(2)}
      </span>
    </div>
  )
}

export default StarRating
