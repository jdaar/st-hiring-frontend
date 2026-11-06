import { describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { makeSetting } from '../../../test/fixtures'
import { renderWithTheme } from '../../../test/render'
import { SettingsTabs } from './SettingsTabs'

const settings = [makeSetting('maxTicketsPerOrder', { value: 10, version: 3 })]

describe('SettingsTabs', () => {
  it('starts on the update tab with the settings form', () => {
    renderWithTheme(<SettingsTabs settings={settings} onSave={vi.fn()} />)

    expect(screen.getByRole('tab', { name: 'Update' })).toHaveAttribute('aria-selected', 'true')
    expect(screen.getByRole('tabpanel', { name: 'Update' })).toContainElement(
      screen.getByLabelText('Max tickets per order'),
    )
    expect(screen.queryByRole('tabpanel', { name: 'New' })).not.toBeInTheDocument()
  })

  it('switches to the new setting form', async () => {
    const { user } = renderWithTheme(<SettingsTabs settings={settings} onSave={vi.fn()} />)

    await user.click(screen.getByRole('tab', { name: 'New' }))

    expect(screen.getByRole('tabpanel', { name: 'New' })).toContainElement(screen.getByLabelText('Key'))
    expect(screen.queryByRole('tabpanel', { name: 'Update' })).not.toBeInTheDocument()
  })

  it('keeps what was typed when switching back and forth', async () => {
    const { user } = renderWithTheme(<SettingsTabs settings={settings} onSave={vi.fn()} initialTab="new" />)

    await user.type(screen.getByLabelText('Key'), 'refundPolicy')
    await user.click(screen.getByRole('tab', { name: 'Update' }))
    await user.click(screen.getByRole('tab', { name: 'New' }))

    expect(screen.getByLabelText('Key')).toHaveValue('refundPolicy')
  })

  it('creates through onSave and goes back to the update tab', async () => {
    const onSave = vi.fn(async () => makeSetting('refundPolicy', { value: 'No refunds' }))
    const { user } = renderWithTheme(<SettingsTabs settings={settings} onSave={onSave} initialTab="new" />)

    await user.type(screen.getByLabelText('Key'), 'refundPolicy')
    await user.type(screen.getByRole('textbox', { name: 'Value' }), 'No refunds')
    await user.click(screen.getByRole('button', { name: 'Add setting' }))

    expect(onSave).toHaveBeenCalledWith({ id: 'refundPolicy', value: 'No refunds' })
    await waitFor(() => expect(screen.getByRole('tab', { name: 'Update' })).toHaveAttribute('aria-selected', 'true'))
  })
})

describe('SettingsTabs cards', () => {
  it('drops the card shadow, as it sits inside a dialog', () => {
    renderWithTheme(<SettingsTabs settings={settings} onSave={vi.fn()} />)
    const card = screen.getByLabelText('Max tickets per order').closest('.MuiCard-root')

    expect(card).toHaveStyle({ boxShadow: 'none' })
  })
})
