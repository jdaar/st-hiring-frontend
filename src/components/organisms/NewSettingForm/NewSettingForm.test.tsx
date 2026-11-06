import { describe, expect, it, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { ApiError } from '@st-hiring/shared'
import { renderWithTheme } from '../../../test/render'
import { makeSetting } from '../../../test/fixtures'
import { UpsertSettingVariables } from '../../../hooks/use-upsert-setting'
import { NewSettingForm } from './NewSettingForm'

const created = (setting: UpsertSettingVariables) => Promise.resolve(makeSetting(setting.id, { value: setting.value }))

const chooseType = async (user: ReturnType<typeof renderWithTheme>['user'], type: string) => {
  await user.click(screen.getByRole('combobox', { name: 'Type' }))
  await user.click(await screen.findByRole('option', { name: type }))
}

describe('NewSettingForm', () => {
  it('creates a text setting and clears itself', async () => {
    const onCreate = vi.fn(created)
    const { user } = renderWithTheme(<NewSettingForm existingIds={[]} onCreate={onCreate} />)

    await user.type(screen.getByLabelText('Key'), ' supportEmail ')
    await user.type(screen.getByRole('textbox', { name: 'Value' }), ' help@example.com ')
    await user.click(screen.getByRole('button', { name: 'Add setting' }))

    await waitFor(() => expect(onCreate).toHaveBeenCalledWith({ id: 'supportEmail', value: 'help@example.com' }))
    await waitFor(() => expect(screen.getByLabelText('Key')).toHaveValue(''))
  })

  it('switches the value input with the type', async () => {
    const onCreate = vi.fn(created)
    const { user } = renderWithTheme(<NewSettingForm existingIds={[]} onCreate={onCreate} />)

    await user.type(screen.getByLabelText('Key'), 'maxTicketsPerOrder')
    await chooseType(user, 'Number')
    await user.type(screen.getByRole('spinbutton', { name: 'Value' }), '8')
    await user.click(screen.getByRole('button', { name: 'Add setting' }))
    await waitFor(() => expect(onCreate).toHaveBeenLastCalledWith({ id: 'maxTicketsPerOrder', value: 8 }))

    await user.type(screen.getByLabelText('Key'), 'salesOpen')
    await chooseType(user, 'On / off')
    await user.click(screen.getByRole('button', { name: 'Add setting' }))
    await waitFor(() => expect(onCreate).toHaveBeenLastCalledWith({ id: 'salesOpen', value: false }))
  })

  it('rejects malformed, taken and empty input before sending it', async () => {
    const onCreate = vi.fn(created)
    const { user } = renderWithTheme(<NewSettingForm existingIds={['salesOpen']} onCreate={onCreate} />)

    await user.type(screen.getByLabelText('Key'), '1 bad key')
    await user.click(screen.getByRole('button', { name: 'Add setting' }))
    expect(await screen.findByText('Letters, digits, "-" or "_", starting with a letter')).toBeInTheDocument()
    expect(screen.getByText('Required')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Key'))
    await user.type(screen.getByLabelText('Key'), 'salesOpen')
    await user.tab()
    expect(await screen.findByText('A setting with this key already exists')).toBeInTheDocument()
    expect(onCreate).not.toHaveBeenCalled()
  })

  it('puts a key taken on the server on the key field, other failures on the form', async () => {
    const onCreate = vi
      .fn()
      .mockRejectedValueOnce(new ApiError({ code: 1003, message: 'exists' }, 409, 'txn'))
      .mockRejectedValueOnce(new ApiError({ code: 1999, message: 'Internal server error' }, 500, 'txn'))
    const { user } = renderWithTheme(<NewSettingForm existingIds={[]} onCreate={onCreate} />)

    await user.type(screen.getByLabelText('Key'), 'supportEmail')
    await user.type(screen.getByRole('textbox', { name: 'Value' }), 'help@example.com')
    await user.click(screen.getByRole('button', { name: 'Add setting' }))
    expect(await screen.findByText('A setting with this key already exists')).toBeInTheDocument()

    await user.clear(screen.getByLabelText('Key'))
    await user.type(screen.getByLabelText('Key'), 'helpEmail')
    await user.click(screen.getByRole('button', { name: 'Add setting' }))
    expect(await screen.findByRole('alert')).toHaveTextContent('Internal server error')
  })
})
