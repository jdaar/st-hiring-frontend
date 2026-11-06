import { keepPreviousData, queryOptions, usePrefetchQuery, useQuery } from '@tanstack/react-query'
import { GetPaginatedEventsEndpoint, GetPaginatedEventsRequest } from '@st-hiring/shared'
import { callEndpoint } from '../api/call-endpoint'
import { queryKeys } from '../api/query/query-keys'
import { useAppDispatch, useAppSelector } from '../store/hooks'
import { nextPage, previousPage, setPage, setPageSize } from '../store/events-pagination.slice'

export const eventsPageQueryOptions = (request: GetPaginatedEventsRequest) =>
  queryOptions({
    queryKey: queryKeys.events.list(request),
    queryFn: ({ signal }) => callEndpoint(GetPaginatedEventsEndpoint, { query: request }, { signal }),
  })

export const usePaginatedEvents = () => {
  const dispatch = useAppDispatch()
  const { page, pageSize } = useAppSelector((state) => state.eventsPagination)

  const query = useQuery({ ...eventsPageQueryOptions({ page, pageSize }), placeholderData: keepPreviousData })

  const pagination = query.data?.pagination
  const lastPage = Math.max(1, pagination?.totalPages ?? 1)
  const hasPreviousPage = page > 1
  const hasNextPage = pagination !== undefined && page < pagination.totalPages

  // no-op for a cached key, so on the last page it points at the current one
  usePrefetchQuery(eventsPageQueryOptions({ page: hasNextPage ? page + 1 : page, pageSize }))

  return {
    ...query,
    events: query.data?.events ?? [],
    pagination,
    page,
    pageSize,
    hasPreviousPage,
    hasNextPage,
    goToPage: (target: number) => dispatch(setPage(Math.min(target, lastPage))),
    nextPage: () => {
      if (hasNextPage) dispatch(nextPage())
    },
    previousPage: () => {
      if (hasPreviousPage) dispatch(previousPage())
    },
    setPageSize: (size: number) => dispatch(setPageSize(size)),
  }
}
