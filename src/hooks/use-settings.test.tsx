import { describe, expect, it } from 'vitest'
import { waitFor } from '@testing-library/react'
import { HttpResponse, http } from 'msw'
import { server } from '../test/server'
import { makeSetting, success } from '../test/fixtures'
import { renderHookWithProviders } from '../test/render'
import { useSetting, useSettings } from './use-settings'

const serveSettings = () => {
  let requests = 0
  server.use(
    http.get('*/v1/settings', () => {
      requests += 1
      return HttpResponse.json(success([makeSetting('a'), makeSetting('b', { value: 7, version: 3 })]))
    }),
  )
  return () => requests
}

describe('useSettings', () => {
  it('loads every setting', async () => {
    serveSettings()

    const { result } = renderHookWithProviders(useSettings)

    await waitFor(() => expect(result.current.isSuccess).toBe(true))
    expect(result.current.data?.map(({ id }) => id)).toEqual(['a', 'b'])
    expect(result.current.data?.[0].updatedAt).toBeInstanceOf(Date)
  })
})

describe('useSetting', () => {
  it('selects one setting out of the shared list request', async () => {
    const requests = serveSettings()

    const { result } = renderHookWithProviders(() => ({ list: useSettings(), b: useSetting('b'), missing: useSetting('z') }))

    await waitFor(() => expect(result.current.b.isSuccess).toBe(true))
    expect(result.current.b.data).toMatchObject({ id: 'b', value: 7, version: 3 })
    expect(result.current.missing.data).toBeUndefined()
    expect(requests()).toBe(1)
  })
})
