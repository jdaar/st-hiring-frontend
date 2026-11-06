import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor } from 'storybook/test'
import { ApiError, Setting } from '@st-hiring/shared'
import { makeSetting } from '../../../test/fixtures'
import { UpsertSettingVariables } from '../../../hooks/use-upsert-setting'
import { SettingsForm, SettingsFormProps } from './SettingsForm'

const settings = [
  makeSetting('maxTicketsPerOrder', { value: 10, version: 3 }),
  makeSetting('salesOpen', { value: true }),
  makeSetting('supportEmail', { value: 'help@example.com', version: 2 }),
]

const saved = (change: UpsertSettingVariables): Promise<Setting> =>
  new Promise((resolve) =>
    setTimeout(
      () => resolve(makeSetting(change.id, { value: change.value, version: ('version' in change ? change.version : 0) + 1 })),
      600,
    ),
  )

const meta = {
  title: 'Organisms/SettingsForm',
  component: SettingsForm,
  args: { settings, onSave: fn(saved) },
  decorators: [(Story) => <div style={{ maxWidth: 480 }}>{Story()}</div>],
} satisfies Meta<typeof SettingsForm>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

// only the changed settings reach onSave, each with the version it was loaded with
export const SaveChanges: Story = {
  play: async ({ canvas, args, step }) => {
    await step('edit a number and a switch', async () => {
      await userEvent.clear(canvas.getByLabelText('Max tickets per order'))
      await userEvent.type(canvas.getByLabelText('Max tickets per order'), '12')
      await userEvent.click(canvas.getByRole('checkbox', { name: 'Sales open' }))
    })

    await step('save', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
      await waitFor(() => expect(args.onSave).toHaveBeenCalledTimes(2))
      await expect(args.onSave).toHaveBeenCalledWith({ id: 'maxTicketsPerOrder', value: 12, version: 3 })
      await expect(args.onSave).toHaveBeenCalledWith({ id: 'salesOpen', value: false, version: 1 })
    })

    await step('saved values become the baseline', async () => {
      await waitFor(() => expect(canvas.getByRole('button', { name: 'Save' })).toBeDisabled())
    })
  },
}

export const ValidationError: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.clear(canvas.getByLabelText('Max tickets per order'))
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))

    await expect(await canvas.findByText('Must be a number')).toBeInTheDocument()
    await expect(canvas.getByLabelText('Max tickets per order')).toHaveAttribute('aria-invalid', 'true')
    await expect(args.onSave).not.toHaveBeenCalled()
  },
}

export const DiscardChanges: Story = {
  play: async ({ canvas, args }) => {
    await userEvent.type(canvas.getByLabelText('Support email'), '.org')
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeEnabled()

    await userEvent.click(canvas.getByRole('button', { name: 'Discard' }))

    await expect(canvas.getByLabelText('Support email')).toHaveValue('help@example.com')
    await expect(canvas.getByRole('button', { name: 'Save' })).toBeDisabled()
    await expect(args.onSave).not.toHaveBeenCalled()
  },
}

export const SaveFails: Story = {
  args: {
    onSave: fn<SettingsFormProps['onSave']>(() =>
      Promise.reject(new ApiError({ code: 1002, message: 'stale version' }, 409, 'story')),
    ),
  },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText('Support email'), '.org')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))

    await expect(
      await canvas.findByText('Changed by someone else, discard to load the latest value'),
    ).toBeInTheDocument()
    await expect(canvas.getByRole('alert')).toHaveTextContent('1 of 1 changes could not be saved')
    await expect(canvas.getByRole('button', { name: 'Discard' })).toBeEnabled()
  },
}

export const SaveNeverFinishes: Story = {
  args: { onSave: fn<SettingsFormProps['onSave']>(() => new Promise(() => {})) },
  play: async ({ canvas }) => {
    await userEvent.type(canvas.getByLabelText('Support email'), '.org')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))

    await waitFor(() => expect(canvas.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-busy', 'true'))
    await expect(canvas.getByRole('button', { name: 'Discard' })).toBeDisabled()
  },
}

export const Empty: Story = {
  args: { settings: [] },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No settings yet.')).toBeInTheDocument()
    await expect(canvas.queryByRole('button')).not.toBeInTheDocument()
  },
}
