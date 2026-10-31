import { useNavigate, useParams } from 'react-router-dom'
import ErrorMessage from '../components/ErrorMessage'
import Loader from '../components/Loader'
import PageShell from '../components/PageShell'
import StarRating from '../components/StarRating'
import { useProduct } from '../hooks/useProduct'
import { formatPrice } from '../utils/format'
import { goBackOrHome } from '../utils/navigation'
import { outlineButtonClass } from '../utils/styles'

function ProductDetailPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data: product, loading, error, retry } = useProduct(id)

  return (
    <PageShell size="narrow">
      <button
        type="button"
        onClick={() => goBackOrHome(navigate)}
        className={outlineButtonClass}
        aria-label="Back to product listing"
      >
        Back
      </button>

      {loading ? <Loader /> : null}
      {!loading && error ? <ErrorMessage message={error} onRetry={retry} /> : null}
      {!loading && !error && product ? (
        <article className="mt-6 grid gap-8 rounded-xl border border-slate-200 bg-white p-4 shadow-sm md:grid-cols-2 md:p-6">
          <div className="overflow-hidden rounded-lg bg-slate-100">
            <img
              src={product.images[0] ?? product.thumbnail}
              alt={`Photograph of ${product.title}`}
              className="h-full w-full object-cover"
            />
          </div>
          <div className="flex flex-col gap-4">
            <p className="text-sm uppercase tracking-wide text-indigo-600">{product.category}</p>
            <h1 className="text-3xl font-semibold text-slate-900">{product.title}</h1>
            <StarRating rating={product.rating} />
            <p className="text-2xl font-semibold text-indigo-700">{formatPrice(product.price)}</p>
            <dl className="space-y-2 text-slate-700">
              {product.brand ? (
                <div>
                  <dt className="inline font-medium text-slate-900">Brand:</dt>{' '}
                  <dd className="inline">{product.brand}</dd>
                </div>
              ) : null}
              <div>
                <dt className="inline font-medium text-slate-900">Category:</dt>{' '}
                <dd className="inline">{product.category}</dd>
              </div>
            </dl>
            <p className="leading-relaxed text-slate-600">{product.description}</p>
          </div>
        </article>
      ) : null}
    </PageShell>
  )
}

export default ProductDetailPage
