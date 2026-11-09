import { describe, expect, it, vi } from 'vitest'
import { screen, waitFor, within } from '@testing-library/react'
import { ApiError, Setting } from '@st-hiring/shared'
import { renderWithTheme } from '../../../test/render'
import { makeSetting } from '../../../test/fixtures'
import { UpsertSettingVariables } from '../../../hooks/use-upsert-setting'
import { SettingsForm } from './SettingsForm'

const settings = [
  makeSetting('maxTicketsPerOrder', { value: 10, version: 3 }),
  makeSetting('salesOpen', { value: true, version: 1 }),
  makeSetting('supportEmail', { value: 'help@example.com', version: 2 }),
]

// resolves like the backend: same value, next version
const saved = (change: UpsertSettingVariables): Promise<Setting> =>
  Promise.resolve(
    makeSetting(change.id, { value: change.value, version: ('version' in change ? change.version : 0) + 1 }),
  )

describe('SettingsForm', () => {
  it('renders an input matching each value type', () => {
    renderWithTheme(<SettingsForm settings={settings} onSave={vi.fn()} />)

    expect(screen.getByRole('spinbutton', { name: 'Max tickets per order' })).toHaveValue(10)
    expect(screen.getByRole('checkbox', { name: 'Sales open' })).toBeChecked()
    expect(screen.getByRole('textbox', { name: 'Support email' })).toHaveValue('help@example.com')
  })

  it('saves only the changed settings, with the version they were loaded with', async () => {
    const onSave = vi.fn(saved)
    const { user } = renderWithTheme(<SettingsForm settings={settings} onSave={onSave} />)

    await user.clear(screen.getByLabelText('Max tickets per order'))
    await user.type(screen.getByLabelText('Max tickets per order'), '12')
    await user.click(screen.getByRole('checkbox', { name: 'Sales open' }))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(2))
    expect(onSave.mock.calls.map(([change]) => change)).toEqual([
      { id: 'maxTicketsPerOrder', value: 12, version: 3 },
      { id: 'salesOpen', value: false, version: 1 },
    ])
    // saved values are the new baseline
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled())
  })

  it('sends the returned version on the next save', async () => {
    const onSave = vi.fn(saved)
    const { user } = renderWithTheme(<SettingsForm settings={settings} onSave={onSave} />)
    const field = screen.getByLabelText('Support email')

    await user.type(field, 'x')
    await user.click(screen.getByRole('button', { name: 'Save' }))
    await waitFor(() => expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled())
    await user.type(field, 'y')
    await user.click(screen.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(onSave).toHaveBeenCalledTimes(2))
    expect(onSave.mock.calls[1][0]).toEqual({ id: 'supportEmail', value: 'help@example.comxy', version: 3 })
  })

  it('does not save an emptied number', async () => {
    const onSave = vi.fn(saved)
    const { user } = renderWithTheme(<SettingsForm settings={settings} onSave={onSave} />)

    await user.clear(screen.getByLabelText('Max tickets per order'))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Must be a number')).toBeInTheDocument()
    expect(onSave).not.toHaveBeenCalled()
  })

  it('keeps a failed save on its field while the others are saved', async () => {
    const conflict = new ApiError({ code: 1002, message: 'stale' }, 409, 'txn')
    const onSave = vi.fn((change: UpsertSettingVariables) =>
      change.id === 'supportEmail' ? Promise.reject(conflict) : saved(change),
    )
    const { user } = renderWithTheme(<SettingsForm settings={settings} onSave={onSave} />)

    await user.type(screen.getByLabelText('Support email'), 'x')
    await user.click(screen.getByRole('checkbox', { name: 'Sales open' }))
    await user.click(screen.getByRole('button', { name: 'Save' }))

    expect(await screen.findByText('Changed by someone else, discard to load the latest value')).toBeInTheDocument()
    expect(screen.getByLabelText('Support email')).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByRole('checkbox', { name: 'Sales open' })).not.toBeChecked()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
  })

  it('discards changes by reloading the current settings', async () => {
    const { user, rerender } = renderWithTheme(<SettingsForm settings={settings} onSave={vi.fn()} />)

    await user.type(screen.getByLabelText('Support email'), 'x')
    const latest = [settings[0], settings[1], makeSetting('supportEmail', { value: 'new@example.com', version: 5 })]
    rerender(<SettingsForm settings={latest} onSave={vi.fn()} />)
    // edits survive a background refetch
    expect(screen.getByLabelText('Support email')).toHaveValue('help@example.comx')

    await user.click(
      within(screen.getByRole('group', { name: 'form actions' })).getByRole('button', { name: 'Discard' }),
    )

    expect(screen.getByLabelText('Support email')).toHaveValue('new@example.com')
  })

  it('says when there are no settings', () => {
    renderWithTheme(<SettingsForm settings={[]} onSave={vi.fn()} />)

    expect(screen.getByText('No settings yet.')).toBeInTheDocument()
    expect(screen.queryByRole('button')).not.toBeInTheDocument()
  })
})
