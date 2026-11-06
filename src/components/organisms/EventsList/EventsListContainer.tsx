import { Event } from '@st-hiring/shared'
import { usePaginatedEvents } from '../../../hooks/use-paginated-events'
import { toErrorMessage } from '../../../forms'
import { EventSummary } from '../../molecules'
import { PaginatedList } from '../PaginatedList'

// PaginatedList on top of usePaginatedEvents: page held in redux, previous page kept while the next loads
export const EventsListContainer = () => {
  const { events, pagination, page, goToPage, isPending, isPlaceholderData, error, refetch } = usePaginatedEvents()

  return (
    <PaginatedList<Event>
      title="Upcoming events"
      subheader={pagination && `${pagination.total} events`}
      items={events}
      getKey={(event) => event.id}
      renderItem={(event) => <EventSummary event={event} />}
      page={page}
      totalPages={pagination?.totalPages ?? 1}
      onPageChange={goToPage}
      loading={isPending}
      updating={isPlaceholderData}
      error={error && toErrorMessage(error)}
      onRetry={() => refetch()}
      emptyText="No upcoming events."
    />
  )
}
