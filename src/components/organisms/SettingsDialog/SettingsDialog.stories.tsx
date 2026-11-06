import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, screen, userEvent, waitFor, within } from 'storybook/test'
import { createSettingsBackend } from '../../../test/handlers'
import { makeSetting } from '../../../test/fixtures'
import { SettingsDialog } from './SettingsDialog'

// the real settings hooks against an in-memory /v1/settings; the modal renders in a portal, so it is found through screen
const backend = createSettingsBackend(
  [makeSetting('maxTicketsPerOrder', { value: 10, version: 3 }), makeSetting('salesOpen', { value: true })],
  { latency: { get: 400, put: 800 } },
)

const SLOW = { timeout: 10_000 }

const meta = {
  title: 'Organisms/SettingsDialog',
  component: SettingsDialog,
  parameters: { msw: { handlers: backend.handlers } },
  beforeEach: backend.reset,
} satisfies Meta<typeof SettingsDialog>

export default meta
type Story = StoryObj<typeof meta>

export const OpenAndClose: Story = {
  play: async ({ canvas, step }) => {
    await step('open the settings', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Settings' }))
      const dialog = await screen.findByRole('dialog', { name: 'Settings' })
      await expect(await within(dialog).findByLabelText('Max tickets per order', {}, SLOW)).toHaveValue(10)
    })

    await step('close them', async () => {
      await userEvent.click(within(screen.getByRole('dialog')).getByRole('button', { name: 'Close' }))
      await waitFor(() => expect(screen.queryByRole('dialog')).not.toBeInTheDocument())
    })
  },
}

// creating from the new tab lands on the update tab with the setting listed
export const AddSetting: Story = {
  play: async ({ canvas, step }) => {
    await userEvent.click(canvas.getByRole('button', { name: 'Settings' }))
    const dialog = within(await screen.findByRole('dialog', { name: 'Settings' }))
    await dialog.findByLabelText('Max tickets per order', {}, SLOW)

    await step('create a setting in the new tab', async () => {
      await userEvent.click(dialog.getByRole('tab', { name: 'New' }))
      await userEvent.type(dialog.getByLabelText('Key'), 'refundPolicy')
      await userEvent.type(dialog.getByRole('textbox', { name: 'Value' }), 'No refunds')
      await userEvent.click(dialog.getByRole('button', { name: 'Add setting' }))
    })

    await step('it shows in the update tab', async () => {
      await waitFor(
        () => expect(dialog.getByRole('tab', { name: 'Update' })).toHaveAttribute('aria-selected', 'true'),
        SLOW,
      )
      await expect(await dialog.findByLabelText('Refund policy', {}, SLOW)).toHaveValue('No refunds')
    })
  },
}
