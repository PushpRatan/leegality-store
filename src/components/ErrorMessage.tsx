import { dangerButtonClass } from '../utils/styles'

type ErrorMessageProps = {
  message: string
  onRetry: () => void
}

function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div
      className="flex min-h-64 flex-col items-center justify-center gap-4 rounded-xl border border-red-200 bg-red-50 p-6 text-center"
      role="alert"
      aria-live="assertive"
    >
      <p className="text-red-800">{message}</p>
      <button type="button" onClick={onRetry} className={dangerButtonClass}>
        Retry
      </button>
    </div>
  )
}

export default ErrorMessage
