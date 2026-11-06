import { GetPaginatedEventsRequest } from '@st-hiring/shared'

// hierarchical, invalidating a prefix invalidates everything below it
export const queryKeys = {
  events: {
    all: ['events'] as const,
    lists: () => [...queryKeys.events.all, 'list'] as const,
    list: (request: GetPaginatedEventsRequest) => [...queryKeys.events.lists(), request] as const,
  },
  settings: {
    all: ['settings'] as const,
    list: () => [...queryKeys.settings.all, 'list'] as const,
    upsert: () => [...queryKeys.settings.all, 'upsert'] as const,
  },
}
