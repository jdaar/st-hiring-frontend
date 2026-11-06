import { describe, expect, it } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { server } from '../../../test/server'
import { createSettingsBackend } from '../../../test/handlers'
import { makeSetting } from '../../../test/fixtures'
import { renderWithProviders } from '../../../test/render'
import { SettingsDialog } from './SettingsDialog'

describe('SettingsDialog', () => {
  it('opens the settings in a modal and closes it', async () => {
    server.use(...createSettingsBackend([makeSetting('maxTicketsPerOrder', { value: 10 })]).handlers)
    const { user } = renderWithProviders(<SettingsDialog />)
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Settings' }))
    const dialog = screen.getByRole('dialog', { name: 'Settings' })
    expect(within(dialog).getByRole('tab', { name: 'Update' })).toBeInTheDocument()
    expect(await within(dialog).findByLabelText('Max tickets per order')).toHaveValue(10)

    await user.click(within(dialog).getByRole('button', { name: 'Close' }))
    await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
  })
})
