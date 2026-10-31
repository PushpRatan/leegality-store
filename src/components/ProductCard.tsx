import { Link } from 'react-router-dom'
import type { Product } from '../types/product'
import { formatPrice } from '../utils/format'
import StarRating from './StarRating'

type ProductCardProps = {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  return (
    <Link
      to={`/product/${product.id}`}
      aria-label={`${product.title}, ${formatPrice(product.price)}, rated ${product.rating.toFixed(2)} out of 5`}
      className="flex h-full flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:border-indigo-300 hover:shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
    >
      <div className="aspect-square bg-slate-100">
        <img src={product.thumbnail} alt="" className="h-full w-full object-cover" />
      </div>
      <div className="flex flex-1 flex-col gap-2 p-4">
        <h2 className="line-clamp-2 font-medium text-slate-900" aria-hidden="true">
          {product.title}
        </h2>
        <p className="text-lg font-semibold text-indigo-700" aria-hidden="true">
          {formatPrice(product.price)}
        </p>
        <StarRating rating={product.rating} decorative />
      </div>
    </Link>
  )
}

export default ProductCard
