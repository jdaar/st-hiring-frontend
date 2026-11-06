import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, waitFor } from 'storybook/test'
import { Setting } from '@st-hiring/shared'
import { makeSetting } from '../../../test/fixtures'
import { UpsertSettingVariables } from '../../../hooks/use-upsert-setting'
import { SettingsTabs } from './SettingsTabs'

const settings = [
  makeSetting('maxTicketsPerOrder', { value: 10, version: 3 }),
  makeSetting('salesOpen', { value: true }),
  makeSetting('supportEmail', { value: 'help@example.com', version: 2 }),
]

const saved = async (change: UpsertSettingVariables): Promise<Setting> =>
  makeSetting(change.id, { value: change.value, version: ('version' in change ? change.version : 0) + 1 })

const meta = {
  title: 'Organisms/SettingsTabs',
  component: SettingsTabs,
  args: { settings, onSave: fn(saved) },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof SettingsTabs>

export default meta
type Story = StoryObj<typeof meta>

export const Update: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('tab', { name: 'Update' })).toHaveAttribute('aria-selected', 'true')
    await expect(canvas.getByLabelText('Max tickets per order')).toHaveValue(10)
  },
}

// typed values survive switching tabs
export const SwitchTabs: Story = {
  play: async ({ canvas, step }) => {
    await step('start typing a new setting', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'New' }))
      await userEvent.type(canvas.getByLabelText('Key'), 'refundPolicy')
    })

    await step('come back to it', async () => {
      await userEvent.click(canvas.getByRole('tab', { name: 'Update' }))
      await expect(canvas.getByLabelText('Max tickets per order')).toBeInTheDocument()
      await userEvent.click(canvas.getByRole('tab', { name: 'New' }))
      await expect(canvas.getByLabelText('Key')).toHaveValue('refundPolicy')
    })
  },
}

// a created setting sends the user back to the update tab
export const CreateSetting: Story = {
  args: { initialTab: 'new' },
  play: async ({ canvas, args }) => {
    await userEvent.type(canvas.getByLabelText('Key'), 'refundPolicy')
    await userEvent.type(canvas.getByRole('textbox', { name: 'Value' }), 'No refunds')
    await userEvent.click(canvas.getByRole('button', { name: 'Add setting' }))

    await expect(args.onSave).toHaveBeenCalledWith({ id: 'refundPolicy', value: 'No refunds' })
    await waitFor(() => expect(canvas.getByRole('tab', { name: 'Update' })).toHaveAttribute('aria-selected', 'true'))
  },
}
