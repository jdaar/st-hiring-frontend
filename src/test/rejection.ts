import { expect } from 'vitest'

// awaits a rejection, asserts its class and returns it typed
export const rejectionOf = async <E extends Error>(
  promise: Promise<unknown>,
  ErrorClass: abstract new (...args: never[]) => E,
): Promise<E> => {
  const error = await promise.then(
    () => undefined,
    (reason: unknown) => reason,
  )
  expect(error).toBeInstanceOf(ErrorClass)
  return error as E
}
