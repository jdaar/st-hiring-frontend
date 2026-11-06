import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { server } from '../../../test/server'
import { createSettingsBackend } from '../../../test/handlers'
import { makeSetting } from '../../../test/fixtures'
import { renderWithProviders, renderWithTheme } from '../../../test/render'
import { OrderLimitBanner } from './OrderLimitBanner'
import { OrderLimitBannerContainer } from './OrderLimitBannerContainer'

describe('OrderLimitBanner', () => {
  it('tells how many tickets one order allows', () => {
    renderWithTheme(<OrderLimitBanner maxTickets={5} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Only 5 tickets can be purchased in the same order')
  })

  it('uses the singular for one ticket', () => {
    renderWithTheme(<OrderLimitBanner maxTickets={1} />)

    expect(screen.getByRole('alert')).toHaveTextContent('Only 1 ticket can be purchased in the same order')
  })
})

describe('OrderLimitBannerContainer', () => {
  it('loads the settings and shows the limit from the redux copy', async () => {
    server.use(...createSettingsBackend([makeSetting('maxTicketsPerOrder', { value: 7 })]).handlers)
    const { store } = renderWithProviders(<OrderLimitBannerContainer />)

    expect(await screen.findByRole('alert')).toHaveTextContent('Only 7 tickets')
    expect(store.getState().settings.values).toEqual({ maxTicketsPerOrder: 7 })
  })

  it('shows the persisted copy before the settings load', () => {
    server.use(...createSettingsBackend([], { latency: { get: 'infinite' } }).handlers)
    renderWithProviders(<OrderLimitBannerContainer />, {
      preloadedState: { settings: { values: { maxTicketsPerOrder: 4 } } },
    })

    expect(screen.getByRole('alert')).toHaveTextContent('Only 4 tickets')
  })

  it('stays hidden without the setting', async () => {
    const backend = createSettingsBackend([makeSetting('salesOpen', { value: true })])
    server.use(...backend.handlers)
    const { store } = renderWithProviders(<OrderLimitBannerContainer />)

    await vi.waitFor(() => expect(store.getState().settings.values).toEqual({ salesOpen: true }))
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })
})
