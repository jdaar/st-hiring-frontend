import { describe, expect, it } from 'vitest'
import { act, waitFor } from '@testing-library/react'
import { Setting } from '@st-hiring/shared'
import { server } from '../test/server'
import { createSettingsBackend } from '../test/handlers'
import { makeSetting } from '../test/fixtures'
import { renderHookWithProviders } from '../test/render'
import { useSettings } from './use-settings'
import { useUpsertSetting } from './use-upsert-setting'

const useSettingsScreen = () => ({ settings: useSettings(), upsert: useUpsertSetting() })

// slow PUTs so the pending state can be observed
const serve = (...args: Parameters<typeof createSettingsBackend>) => {
  const backend = createSettingsBackend(args[0], { latency: { put: 50 }, ...args[1] })
  server.use(...backend.handlers)
  return backend
}

const summary = (settings?: Setting[]) => settings?.map(({ id, value, version }) => [id, value, version])

describe('useUpsertSetting', () => {
  it('shows a pending update in useSettings, then the refetched list', async () => {
    const backend = serve([makeSetting('a', { value: 'old' })])

    const { result } = renderHookWithProviders(useSettingsScreen)
    await waitFor(() => expect(result.current.settings.isSuccess).toBe(true))

    act(() => result.current.upsert.mutate({ id: 'a', value: 'new', version: 1 }))

    await waitFor(() => expect(result.current.upsert.isPending).toBe(true))
    expect(summary(result.current.settings.data)).toEqual([['a', 'new', 2]])

    await waitFor(() => expect(result.current.upsert.isSuccess).toBe(true))
    expect(summary(result.current.settings.data)).toEqual([['a', 'new', 2]])
    expect(backend.calls.get).toBe(2)
  })

  it('shows a pending creation in id order', async () => {
    serve([makeSetting('b')])

    const { result } = renderHookWithProviders(useSettingsScreen)
    await waitFor(() => expect(result.current.settings.isSuccess).toBe(true))

    act(() => result.current.upsert.mutate({ id: 'a', value: 1 }))

    await waitFor(() => expect(result.current.upsert.isPending).toBe(true))
    expect(summary(result.current.settings.data)).toEqual([
      ['a', 1, 1],
      ['b', 'b-value', 1],
    ])
  })

  it('drops the optimistic value on a conflict and shows the latest version', async () => {
    const backend = serve([makeSetting('a', { value: 'old' })], {
      concurrentEdit: (stored) => ({ ...stored, value: 'theirs', version: 3 }),
    })

    const { result } = renderHookWithProviders(useSettingsScreen)
    await waitFor(() => expect(result.current.settings.isSuccess).toBe(true))

    act(() => result.current.upsert.mutate({ id: 'a', value: 'mine', version: 1 }))

    await waitFor(() => expect(result.current.upsert.isError).toBe(true))
    expect(result.current.upsert.error).toMatchObject({ code: 1002, httpCode: 409 })
    expect(summary(result.current.settings.data)).toEqual([['a', 'theirs', 3]])
    expect(backend.calls.put).toHaveLength(1)
  })
})
