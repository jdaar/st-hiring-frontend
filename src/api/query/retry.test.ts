import { describe, expect, it } from 'vitest'
import { ApiError, NetworkError, RequestValidationError, ResponseValidationError } from '@st-hiring/shared'
import {
  MAX_MUTATION_RETRIES,
  MAX_QUERY_RETRIES,
  backoffDelay,
  isTransientError,
  retryDelay,
  shouldRetryMutation,
  shouldRetryQuery,
} from './retry'

const apiError = (httpCode: number) => new ApiError({ code: 1000, message: 'failed' }, httpCode, 'txn')

describe('isTransientError', () => {
  it.each([
    ['a network error', new NetworkError('txn')],
    ['a 500', apiError(500)],
    ['a 503', apiError(503)],
    ['a request timeout', apiError(408)],
    ['rate limiting', apiError(429)],
  ])('retries %s', (_name, error) => {
    expect(isTransientError(error)).toBe(true)
  })

  it.each([
    ['a validation failure', apiError(400)],
    ['a missing resource', apiError(404)],
    ['a version conflict', apiError(409)],
    ['invalid input', new RequestValidationError([])],
    ['an unexpected response', new ResponseValidationError([], 200, 'txn')],
    ['an abort', new DOMException('aborted', 'AbortError')],
  ])('does not retry %s', (_name, error) => {
    expect(isTransientError(error)).toBe(false)
  })
})

describe('shouldRetry', () => {
  it(`gives queries up to ${MAX_QUERY_RETRIES} retries`, () => {
    const error = apiError(503)
    expect([0, 1, 2, 3].map((failureCount) => shouldRetryQuery(failureCount, error))).toEqual([true, true, true, false])
  })

  it(`gives mutations up to ${MAX_MUTATION_RETRIES} retries`, () => {
    const error = new NetworkError('txn')
    expect([0, 1, 2].map((failureCount) => shouldRetryMutation(failureCount, error))).toEqual([true, true, false])
  })

  it('never retries permanent errors', () => {
    expect(shouldRetryQuery(0, apiError(409))).toBe(false)
  })
})

describe('backoff', () => {
  it('doubles the delay on every attempt', () => {
    expect([0, 1, 2, 3].map((attempt) => backoffDelay(attempt, 1))).toEqual([500, 1000, 2000, 4000])
  })

  it('caps the delay at 10s', () => {
    expect(backoffDelay(20, 1)).toBe(10_000)
  })

  it('jitters between 50% and 100% of the delay', () => {
    expect(backoffDelay(1, 0)).toBe(500)
    for (let i = 0; i < 50; i++) {
      const delay = retryDelay(1)
      expect(delay).toBeGreaterThanOrEqual(500)
      expect(delay).toBeLessThanOrEqual(1000)
    }
  })
})
