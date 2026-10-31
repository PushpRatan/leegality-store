import { useEffect, useState } from 'react'
import { getErrorMessage, isAbortError } from '../utils/errors'

export type AsyncResource<T> = {
  data: T | null
  loading: boolean
  error: string | null
  retry: () => void
}

type UseAsyncResourceOptions = {
  enabled?: boolean
  disabledError?: string
}

export function useAsyncResource<T>(
  fetcher: (signal: AbortSignal) => Promise<T>,
  options?: UseAsyncResourceOptions,
): AsyncResource<T> {
  const enabled = options?.enabled ?? true
  const disabledError = options?.disabledError ?? null
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(enabled)
  const [error, setError] = useState<string | null>(null)
  const [retryCount, setRetryCount] = useState(0)
  const retry = () => setRetryCount((count) => count + 1)

  useEffect(() => {
    if (!enabled) {
      return
    }

    const controller = new AbortController()

    async function load() {
      setLoading(true)
      setError(null)

      try {
        const result = await fetcher(controller.signal)
        setData(result)
      } catch (caughtError) {
        if (isAbortError(caughtError)) {
          return
        }

        setData(null)
        setError(getErrorMessage(caughtError))
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      controller.abort()
    }
  }, [enabled, fetcher, retryCount])

  if (!enabled) {
    return { data: null, loading: false, error: disabledError, retry }
  }

  return { data, loading, error, retry }
}
