import { describe, expect, it } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { server } from '../../../test/server'
import { createSettingsBackend } from '../../../test/handlers'
import { makeSetting } from '../../../test/fixtures'
import { renderWithProviders } from '../../../test/render'
import { SettingsFormContainer } from './SettingsFormContainer'

const settings = [
  makeSetting('maxTicketsPerOrder', { value: 10, version: 3 }),
  makeSetting('salesOpen', { value: true }),
]

describe('SettingsFormContainer', () => {
  it('loads the settings, saves a change and shows the refetched version', async () => {
    const backend = createSettingsBackend(settings)
    server.use(...backend.handlers)
    const { user } = renderWithProviders(<SettingsFormContainer />)

    const field = await screen.findByLabelText('Max tickets per order')
    await user.clear(field)
    await user.type(field, '12')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(backend.calls.get).toBe(2))
    expect(backend.calls.put).toEqual([{ id: 'maxTicketsPerOrder', body: { value: 12, version: 3 } }])
    expect(backend.stored()[0]).toMatchObject({ value: 12, version: 4 })
    expect(screen.getByLabelText('Max tickets per order')).toHaveValue(12)
    expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
  })

  it('shows a conflict on the field and loads the latest value on discard', async () => {
    const backend = createSettingsBackend(settings, {
      concurrentEdit: (stored) => ({ ...stored, value: 20, version: stored.version + 1 }),
    })
    server.use(...backend.handlers)
    const { user } = renderWithProviders(<SettingsFormContainer />)

    const field = await screen.findByLabelText('Max tickets per order')
    await user.clear(field)
    await user.type(field, '12')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Changed by someone else, discard to load the latest value')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Discard' }))
    await waitFor(() => expect(screen.getByLabelText('Max tickets per order')).toHaveValue(20))
  })

  it('shows a retryable error when the settings cannot be loaded', async () => {
    const backend = createSettingsBackend(settings, { failGet: 503 })
    server.use(...backend.handlers)

    renderWithProviders(<SettingsFormContainer />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Internal server error')
    // the first attempt plus three retries
    expect(backend.calls.get).toBe(4)
    expect(screen.getByRole('button', { name: 'Retry' })).toBeInTheDocument()
  })
})
