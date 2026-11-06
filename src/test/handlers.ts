import { HttpResponse, delay, http } from 'msw'
import { Event, Setting, UpsertSettingRequest, isUpdateSettingRequest } from '@st-hiring/shared'
import { failure, success } from './fixtures'

type Latency = number | 'infinite'

export interface SettingsBackendOptions {
  latency?: { get?: Latency; put?: Latency }
  // answer with this status instead
  failGet?: number
  failPut?: number
  // someone else saves first: the next update gets a 409 and the stored setting becomes the returned one
  concurrentEdit?: (stored: Setting) => Setting
}

const byId = (a: Setting, b: Setting) => a.id.localeCompare(b.id)

// in-memory /v1/settings with the backend's create / versioned update rules
export const createSettingsBackend = (initial: Setting[], options: SettingsBackendOptions = {}) => {
  let stored: Setting[] = []
  let pendingConcurrentEdit: SettingsBackendOptions['concurrentEdit']
  const calls = { get: 0, put: [] as { id: string; body: UpsertSettingRequest }[] }

  // back to the initial settings, e.g. before a story replays its interactions
  const reset = () => {
    stored = [...initial].sort(byId)
    pendingConcurrentEdit = options.concurrentEdit
    calls.get = 0
    calls.put = []
  }
  reset()

  const replace = (setting: Setting) => {
    stored = stored.map((current) => (current.id === setting.id ? setting : current))
  }

  const handlers = [
    http.get('*/v1/settings', async () => {
      calls.get += 1
      if (options.latency?.get !== undefined) await delay(options.latency.get)
      if (options.failGet) return HttpResponse.json(failure(1999, 'Internal server error'), { status: options.failGet })
      return HttpResponse.json(success(stored))
    }),

    http.put<{ id: string }, UpsertSettingRequest>('*/v1/settings/:id', async ({ params: { id }, request }) => {
      const body = await request.json()
      calls.put.push({ id, body })
      if (options.latency?.put !== undefined) await delay(options.latency.put)
      if (options.failPut) return HttpResponse.json(failure(1999, 'Internal server error'), { status: options.failPut })

      const existing = stored.find((setting) => setting.id === id)
      const now = new Date()

      if (!isUpdateSettingRequest(body)) {
        if (existing) {
          return HttpResponse.json(failure(1003, `Setting "${id}" already exists; send its version to update it`), {
            status: 409,
          })
        }
        const created: Setting = { id, value: body.value, version: 1, createdAt: now, updatedAt: now }
        stored = [...stored, created].sort(byId)
        return HttpResponse.json(success(created), { status: 201 })
      }

      if (!existing) return HttpResponse.json(failure(1001, `Setting "${id}" does not exist`), { status: 404 })

      if (pendingConcurrentEdit) {
        replace(pendingConcurrentEdit(existing))
        pendingConcurrentEdit = undefined
      }

      const current = stored.find((setting) => setting.id === id) ?? existing
      if (current.version !== body.version) {
        return HttpResponse.json(failure(1002, `Setting "${id}" was modified; version ${body.version} is stale`), {
          status: 409,
        })
      }

      const updated: Setting = { ...current, value: body.value, version: current.version + 1, updatedAt: now }
      replace(updated)
      return HttpResponse.json(success(updated))
    }),
  ]

  return { handlers, calls, reset, stored: () => stored }
}

export interface EventsBackendOptions {
  latency?: Latency
  // answer with this status instead
  failGet?: number
}

// in-memory /v1/events paged like the backend
export const createEventsBackend = (events: Event[], options: EventsBackendOptions = {}) => {
  const calls = { pages: [] as number[] }
  const reset = () => {
    calls.pages = []
  }

  const handlers = [
    http.get('*/v1/events', async ({ request }) => {
      const url = new URL(request.url)
      const page = Number(url.searchParams.get('page'))
      const pageSize = Number(url.searchParams.get('pageSize'))
      calls.pages.push(page)
      if (options.latency !== undefined) await delay(options.latency)
      if (options.failGet) return HttpResponse.json(failure(1999, 'Internal server error'), { status: options.failGet })

      return HttpResponse.json(
        success({
          events: events.slice((page - 1) * pageSize, page * pageSize),
          pagination: { page, pageSize, total: events.length, totalPages: Math.ceil(events.length / pageSize) },
        }),
      )
    }),
  ]

  return { handlers, calls, reset }
}
