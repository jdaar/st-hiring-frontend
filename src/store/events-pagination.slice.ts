import { createSlice, PayloadAction } from '@reduxjs/toolkit'
import { EVENTS_MAX_PAGE_SIZE } from '@st-hiring/shared'

export interface EventsPaginationState {
  page: number
  pageSize: number
}

export const DEFAULT_EVENTS_PAGE_SIZE = 10

const initialState: EventsPaginationState = { page: 1, pageSize: DEFAULT_EVENTS_PAGE_SIZE }

const toPage = (page: number) => Math.max(1, Math.trunc(page) || 1)

export const eventsPaginationSlice = createSlice({
  name: 'eventsPagination',
  initialState,
  reducers: {
    setPage: (state, { payload }: PayloadAction<number>) => {
      state.page = toPage(payload)
    },
    nextPage: (state) => {
      state.page += 1
    },
    previousPage: (state) => {
      state.page = toPage(state.page - 1)
    },
    // page boundaries move, start over
    setPageSize: (state, { payload }: PayloadAction<number>) => {
      state.pageSize = Math.min(EVENTS_MAX_PAGE_SIZE, Math.max(1, Math.trunc(payload) || DEFAULT_EVENTS_PAGE_SIZE))
      state.page = 1
    },
  },
})

export const { setPage, nextPage, previousPage, setPageSize } = eventsPaginationSlice.actions
