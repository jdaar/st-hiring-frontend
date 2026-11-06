import { describe, expect, it } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { HttpResponse, delay, http } from 'msw'
import { Event } from '@st-hiring/shared'
import { server } from '../test/server'
import { failure, makeEvent, success } from '../test/fixtures'
import { renderHookWithProviders } from '../test/render'
import { usePaginatedEvents } from './use-paginated-events'

// serves `events` page by page like the backend, recording every page requested
const serveEvents = (events: Event[], { slowPages = [] as number[] } = {}) => {
  const requestedPages: number[] = []
  server.use(
    http.get('*/v1/events', async ({ request }) => {
      const url = new URL(request.url)
      const page = Number(url.searchParams.get('page'))
      const pageSize = Number(url.searchParams.get('pageSize'))
      requestedPages.push(page)
      if (slowPages.includes(page)) await delay(50)

      return HttpResponse.json(
        success({
          events: events.slice((page - 1) * pageSize, page * pageSize),
          pagination: { page, pageSize, total: events.length, totalPages: Math.ceil(events.length / pageSize) },
        }),
      )
    }),
  )
  return requestedPages
}

const events = (count: number) => Array.from({ length: count }, (_, i) => makeEvent(i + 1))

describe('usePaginatedEvents', () => {
  it('loads the page held in the store', async () => {
    serveEvents(events(5))

    const { result } = renderHookWithProviders(usePaginatedEvents, {
      preloadedState: { eventsPagination: { page: 2, pageSize: 2 } },
    })

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.events.map(({ id }) => id)).toEqual([3, 4])
    expect(result.current.pagination).toEqual({ page: 2, pageSize: 2, total: 5, totalPages: 3 })
    expect(result.current.hasPreviousPage).toBe(true)
    expect(result.current.hasNextPage).toBe(true)
  })

  it('prefetches the next page', async () => {
    const requestedPages = serveEvents(events(5))

    const { result } = renderHookWithProviders(usePaginatedEvents, {
      preloadedState: { eventsPagination: { page: 1, pageSize: 2 } },
    })

    await waitFor(() => expect(requestedPages).toEqual([1, 2]))

    act(() => result.current.nextPage())

    // served from the prefetched cache, no new request and no loading state
    expect(result.current.events.map(({ id }) => id)).toEqual([3, 4])
    expect(result.current.page).toBe(2)
  })

  it('keeps showing the previous page while another one loads', async () => {
    serveEvents(events(10), { slowPages: [4] })

    const { result } = renderHookWithProviders(usePaginatedEvents, {
      preloadedState: { eventsPagination: { page: 1, pageSize: 2 } },
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => {
      result.current.goToPage(4)
    })

    expect(result.current.page).toBe(4)
    expect(result.current.isPlaceholderData).toBe(true)
    expect(result.current.events.map(({ id }) => id)).toEqual([1, 2])

    await waitFor(() => expect(result.current.isPlaceholderData).toBe(false))
    expect(result.current.events.map(({ id }) => id)).toEqual([7, 8])
  })

  it('stays within the existing pages', async () => {
    serveEvents(events(3))

    const { result, store } = renderHookWithProviders(usePaginatedEvents, {
      preloadedState: { eventsPagination: { page: 2, pageSize: 2 } },
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => result.current.nextPage())
    expect(store.getState().eventsPagination.page).toBe(2)

    act(() => {
      result.current.goToPage(10)
    })
    expect(store.getState().eventsPagination.page).toBe(2)
  })

  it('changing the page size starts over from the first page', async () => {
    serveEvents(events(10))

    const { result } = renderHookWithProviders(usePaginatedEvents, {
      preloadedState: { eventsPagination: { page: 3, pageSize: 2 } },
    })
    await waitFor(() => expect(result.current.isSuccess).toBe(true))

    act(() => {
      result.current.setPageSize(5)
    })

    await waitFor(() => expect(result.current.events.map(({ id }) => id)).toEqual([1, 2, 3, 4, 5]))
    expect(result.current.page).toBe(1)
  })

  it('retries transient failures', async () => {
    let attempts = 0
    server.use(
      http.get('*/v1/events', () => {
        attempts += 1
        if (attempts < 3) return HttpResponse.json(failure(1999, 'Internal server error'), { status: 503 })
        return HttpResponse.json(
          success({ events: [makeEvent(1)], pagination: { page: 1, pageSize: 10, total: 1, totalPages: 1 } }),
        )
      }),
    )

    const { result } = renderHookWithProviders(usePaginatedEvents)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(attempts).toBe(3)
  })

  it('does not retry permanent failures', async () => {
    let attempts = 0
    server.use(
      http.get('*/v1/events', () => {
        attempts += 1
        return HttpResponse.json(failure(1000, 'Validation failed'), { status: 400 })
      }),
    )

    const { result } = renderHookWithProviders(usePaginatedEvents)

    await waitFor(() => expect(result.current.isError).toBe(true))
    expect(result.current.error).toMatchObject({ code: 1000, httpCode: 400 })
    expect(attempts).toBe(1)
  })
})
