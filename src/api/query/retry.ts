import { ApiError, NetworkError } from '@st-hiring/shared'

export const MAX_QUERY_RETRIES = 3
export const MAX_MUTATION_RETRIES = 2

const BASE_DELAY_MS = 500
const MAX_DELAY_MS = 10_000

const RETRYABLE_CLIENT_STATUSES = new Set([408, 429])

// no answer, a server failure, a timeout or rate limiting; any other 4xx would fail the same way again
export const isTransientError = (error: unknown) =>
  error instanceof NetworkError ||
  (error instanceof ApiError && (error.httpCode >= 500 || RETRYABLE_CLIENT_STATUSES.has(error.httpCode)))

const createShouldRetry = (maxRetries: number) => (failureCount: number, error: unknown) =>
  failureCount < maxRetries && isTransientError(error)

export const shouldRetryQuery = createShouldRetry(MAX_QUERY_RETRIES)

export const shouldRetryMutation = createShouldRetry(MAX_MUTATION_RETRIES)

export const backoffDelay = (attemptIndex: number, jitter: number) =>
  Math.min(BASE_DELAY_MS * 2 ** attemptIndex, MAX_DELAY_MS) * (0.5 + jitter / 2)

export const retryDelay = (attemptIndex: number) => backoffDelay(attemptIndex, Math.random())
