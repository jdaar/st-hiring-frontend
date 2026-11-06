import { combineReducers, configureStore } from '@reduxjs/toolkit'
import { eventsPaginationSlice } from './events-pagination.slice'

const rootReducer = combineReducers({
  [eventsPaginationSlice.name]: eventsPaginationSlice.reducer,
})

export type RootState = ReturnType<typeof rootReducer>

export const createStore = (preloadedState?: Partial<RootState>) => configureStore({ reducer: rootReducer, preloadedState })

export type AppStore = ReturnType<typeof createStore>

export type AppDispatch = AppStore['dispatch']
