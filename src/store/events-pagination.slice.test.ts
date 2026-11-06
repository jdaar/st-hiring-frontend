import { describe, expect, it } from 'vitest'
import { EVENTS_MAX_PAGE_SIZE } from '@st-hiring/shared'
import {
  DEFAULT_EVENTS_PAGE_SIZE,
  eventsPaginationSlice,
  nextPage,
  previousPage,
  setPage,
  setPageSize,
} from './events-pagination.slice'

const { reducer } = eventsPaginationSlice
const state = (page: number, pageSize = DEFAULT_EVENTS_PAGE_SIZE) => ({ page, pageSize })

describe('eventsPagination slice', () => {
  it('starts on the first page', () => {
    expect(reducer(undefined, { type: 'init' })).toEqual(state(1))
  })

  it('moves between pages', () => {
    expect(reducer(state(2), nextPage())).toEqual(state(3))
    expect(reducer(state(2), previousPage())).toEqual(state(1))
  })

  it('never goes before the first page', () => {
    expect(reducer(state(1), previousPage())).toEqual(state(1))
    expect(reducer(state(3), setPage(0))).toEqual(state(1))
    expect(reducer(state(3), setPage(-4))).toEqual(state(1))
    expect(reducer(state(3), setPage(Number.NaN))).toEqual(state(1))
  })

  it('jumps to a page', () => {
    expect(reducer(state(1), setPage(7))).toEqual(state(7))
    expect(reducer(state(1), setPage(2.9))).toEqual(state(2))
  })

  it('goes back to the first page when the page size changes', () => {
    expect(reducer(state(5, 10), setPageSize(25))).toEqual(state(1, 25))
  })

  it('keeps the page size within what the backend accepts', () => {
    expect(reducer(state(1), setPageSize(EVENTS_MAX_PAGE_SIZE + 1)).pageSize).toBe(EVENTS_MAX_PAGE_SIZE)
    expect(reducer(state(1), setPageSize(0)).pageSize).toBe(DEFAULT_EVENTS_PAGE_SIZE)
    expect(reducer(state(1), setPageSize(-3)).pageSize).toBe(1)
  })
})
