import { describe, expect, it } from 'vitest'
import { HttpResponse, delay, http } from 'msw'
import {
  ApiError,
  ApplicationError,
  GetPaginatedEventsEndpoint,
  GetSettingsEndpoint,
  NetworkError,
  RequestValidationError,
  ResponseValidationError,
  TRANSACTION_ID_HEADER,
  UpsertSettingEndpoint,
} from '@st-hiring/shared'
import { server } from '../test/server'
import { rejectionOf } from '../test/rejection'
import { failure, makeEvent, makeSetting, success } from '../test/fixtures'
import { callEndpoint } from './call-endpoint'

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/

const eventsPage = success({
  events: [makeEvent(1)],
  pagination: { page: 1, pageSize: 1, total: 1, totalPages: 1 },
})

describe('callEndpoint', () => {
  it('sends the validated query with a fresh X-Transaction-Id on every call', async () => {
    const requests: Request[] = []
    server.use(
      http.get('*/v1/events', ({ request }) => {
        requests.push(request)
        return HttpResponse.json(eventsPage)
      }),
    )

    await callEndpoint(GetPaginatedEventsEndpoint, { query: { page: 1, pageSize: 1 } })
    await callEndpoint(GetPaginatedEventsEndpoint, { query: { page: 1, pageSize: 1 } })

    const [first, second] = requests.map((request) => request.headers.get(TRANSACTION_ID_HEADER))
    expect(first).toMatch(UUID)
    expect(second).toMatch(UUID)
    expect(first).not.toBe(second)
    expect(new URL(requests[0].url).search).toBe('?page=1&pageSize=1')
  })

  it('casts the response through the response DTO', async () => {
    server.use(http.get('*/v1/events', () => HttpResponse.json(eventsPage)))

    const { events, pagination } = await callEndpoint(GetPaginatedEventsEndpoint, { query: { page: 1, pageSize: 1 } })

    expect(events[0].date).toBeInstanceOf(Date)
    expect(events[0].date.toISOString()).toBe('2026-12-01T20:00:00.000Z')
    expect(pagination.totalPages).toBe(1)
  })

  it('drops response fields the DTO does not know about', async () => {
    server.use(
      http.get('*/v1/settings', () =>
        HttpResponse.json({ isSuccess: true, body: [{ ...makeSetting('a'), internal: 'x' }] }),
      ),
    )

    const [setting] = await callEndpoint(GetSettingsEndpoint, {})

    expect(setting).not.toHaveProperty('internal')
  })

  it('rejects invalid input without sending a request', async () => {
    let sent = false
    server.use(
      http.get('*/v1/events', () => {
        sent = true
        return HttpResponse.json(eventsPage)
      }),
    )

    const error = await rejectionOf(
      callEndpoint(GetPaginatedEventsEndpoint, { query: { page: 0, pageSize: 500 } }),
      RequestValidationError,
    )

    expect(error).toBeInstanceOf(ApplicationError)
    expect(error.code).toBe(2001)
    expect(error.details.map(({ path }) => path).sort()).toEqual(['page', 'pageSize'])
    expect(sent).toBe(false)
  })

  it('rejects unknown body keys like the backend does', async () => {
    const error = await rejectionOf(
      // @ts-expect-error id is not part of the body
      callEndpoint(UpsertSettingEndpoint, { params: { id: 'a' }, body: { value: 1, id: 'a' } }),
      RequestValidationError,
    )

    expect(error.details).toEqual([{ path: 'body', message: 'this field has unspecified keys: id' }])
  })

  it('encodes path params and sends the body as JSON', async () => {
    let received: { path: string; body: unknown; contentType: string | null } | undefined
    server.use(
      http.put('*/v1/settings/:id', async ({ request }) => {
        received = {
          path: new URL(request.url).pathname,
          body: await request.json(),
          contentType: request.headers.get('Content-Type'),
        }
        return HttpResponse.json(success(makeSetting('a b/c', { value: 2, version: 2 })))
      }),
    )

    const setting = await callEndpoint(UpsertSettingEndpoint, {
      params: { id: 'a b/c' },
      body: { value: 2, version: 1 },
    })

    expect(received).toEqual({
      path: '/v1/settings/a%20b%2Fc',
      body: { value: 2, version: 1 },
      contentType: 'application/json',
    })
    expect(setting.version).toBe(2)
  })

  it('turns a failure envelope into an ApiError carrying the echoed transaction id', async () => {
    server.use(
      http.put('*/v1/settings/:id', ({ request }) =>
        HttpResponse.json(failure(1002, 'Setting "a" was modified; version 1 is stale'), {
          status: 409,
          headers: { [TRANSACTION_ID_HEADER]: request.headers.get(TRANSACTION_ID_HEADER)! },
        }),
      ),
    )

    const error = await rejectionOf(
      callEndpoint(UpsertSettingEndpoint, { params: { id: 'a' }, body: { value: 2, version: 1 } }),
      ApiError,
    )

    expect(error).toBeInstanceOf(ApplicationError)
    expect(error).toMatchObject({ code: 1002, httpCode: 409, message: 'Setting "a" was modified; version 1 is stale' })
    expect(error.transactionId).toMatch(UUID)
  })

  it('rejects a response that does not match the DTO', async () => {
    server.use(http.get('*/v1/events', () => HttpResponse.json(success({ events: [{ id: 'nope' }], pagination: {} }))))

    const error = await rejectionOf(
      callEndpoint(GetPaginatedEventsEndpoint, { query: { page: 1, pageSize: 1 } }),
      ResponseValidationError,
    )

    expect(error.details.length).toBeGreaterThan(0)
  })

  it('rejects a response that is not JSON', async () => {
    server.use(http.get('*/v1/settings', () => new HttpResponse('<html>bad gateway</html>', { status: 502 })))

    const error = await rejectionOf(callEndpoint(GetSettingsEndpoint, {}), ResponseValidationError)

    expect(error).toMatchObject({ code: 2002, httpCode: 502 })
  })

  it('turns a failed fetch into a NetworkError', async () => {
    server.use(http.get('*/v1/settings', () => HttpResponse.error()))

    const error = await rejectionOf(callEndpoint(GetSettingsEndpoint, {}), NetworkError)

    expect(error).toBeInstanceOf(ApplicationError)
    expect(error.code).toBe(2000)
    expect(error.transactionId).toMatch(UUID)
  })

  it('lets aborts through untouched', async () => {
    server.use(
      http.get('*/v1/settings', async () => {
        await delay('infinite')
        return HttpResponse.json(success([]))
      }),
    )
    const controller = new AbortController()

    const pending = rejectionOf(callEndpoint(GetSettingsEndpoint, {}, { signal: controller.signal }), DOMException)
    controller.abort()

    expect((await pending).name).toBe('AbortError')
  })
})
