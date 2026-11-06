import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, waitFor } from 'storybook/test'
import { ApiError, Setting } from '@st-hiring/shared'
import { makeSetting } from '../../../test/fixtures'
import { pickOption, setupUser } from '../../../test/interactions'
import { UpsertSettingVariables } from '../../../hooks/use-upsert-setting'
import { NewSettingForm, NewSettingFormProps } from './NewSettingForm'

const created = (setting: UpsertSettingVariables): Promise<Setting> =>
  new Promise((resolve) => setTimeout(() => resolve(makeSetting(setting.id, { value: setting.value })), 600))

const meta = {
  title: 'Organisms/NewSettingForm',
  component: NewSettingForm,
  args: { existingIds: ['maxTicketsPerOrder', 'salesOpen'], onCreate: fn(created) },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof NewSettingForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AddNumber: Story = {
  play: async ({ canvas, args, step }) => {
    const user = setupUser()
    await step('fill in a key, a type and a value', async () => {
      await user.type(canvas.getByLabelText('Key'), 'refundWindowDays')
      await pickOption(user, canvas.getByRole('combobox', { name: 'Type' }), 'Number')
      await user.type(canvas.getByRole('spinbutton', { name: 'Value' }), '14')
    })

    await step('add it', async () => {
      await user.click(canvas.getByRole('button', { name: 'Add setting' }))
      await waitFor(() => expect(args.onCreate).toHaveBeenCalledWith({ id: 'refundWindowDays', value: 14 }))
      // cleared once created
      await waitFor(() => expect(canvas.getByLabelText('Key')).toHaveValue(''))
    })
  },
}

export const AddSwitch: Story = {
  play: async ({ canvas, args }) => {
    const user = setupUser()
    await user.type(canvas.getByLabelText('Key'), 'presaleEnabled')
    await pickOption(user, canvas.getByRole('combobox', { name: 'Type' }), 'On / off')
    await user.click(canvas.getByRole('checkbox', { name: 'Value' }))
    await user.click(canvas.getByRole('button', { name: 'Add setting' }))

    await waitFor(() => expect(args.onCreate).toHaveBeenCalledWith({ id: 'presaleEnabled', value: true }))
  },
}

export const Invalid: Story = {
  play: async ({ canvas, args }) => {
    const user = setupUser()
    await user.type(canvas.getByLabelText('Key'), 'salesOpen')
    await user.click(canvas.getByRole('button', { name: 'Add setting' }))

    await expect(await canvas.findByText('A setting with this key already exists')).toBeInTheDocument()
    await expect(await canvas.findByText('Required')).toBeInTheDocument()
    await expect(args.onCreate).not.toHaveBeenCalled()
  },
}

// someone else created the same key in the meantime
export const TakenOnTheServer: Story = {
  args: {
    onCreate: fn<NewSettingFormProps['onCreate']>(() =>
      Promise.reject(new ApiError({ code: 1003, message: 'Setting "x" already exists' }, 409, 'story')),
    ),
  },
  play: async ({ canvas }) => {
    const user = setupUser()
    await user.type(canvas.getByLabelText('Key'), 'supportEmail')
    await user.type(canvas.getByRole('textbox', { name: 'Value' }), 'help@example.com')
    await user.click(canvas.getByRole('button', { name: 'Add setting' }))

    await expect(await canvas.findByText('A setting with this key already exists')).toBeInTheDocument()
    await expect(canvas.getByLabelText('Key')).toHaveAttribute('aria-invalid', 'true')
  },
}
