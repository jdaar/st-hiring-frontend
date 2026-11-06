import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, userEvent, waitFor } from 'storybook/test'
import { SettingsBackendOptions, createSettingsBackend } from '../../../test/handlers'
import { makeSetting } from '../../../test/fixtures'
import { SettingsFormContainer } from './SettingsFormContainer'

// the real hooks (retries, optimistic list, refetch) against an in-memory /v1/settings served by MSW
const settings = [
  makeSetting('maxTicketsPerOrder', { value: 10, version: 3 }),
  makeSetting('salesOpen', { value: true }),
  makeSetting('supportEmail', { value: 'help@example.com', version: 2 }),
]

// realistic latency so loading and saving states are visible; reset so replays start from the same data
const connected = (options: SettingsBackendOptions = {}) => {
  const backend = createSettingsBackend(settings, {
    ...options,
    latency: { get: 400, put: 800, ...options.latency },
  })

  return { parameters: { msw: { handlers: backend.handlers } }, beforeEach: backend.reset }
}

const SLOW = { timeout: 10_000 }

const meta = {
  title: 'Organisms/SettingsForm/Connected',
  component: SettingsFormContainer,
  decorators: [(Story) => <div style={{ maxWidth: 480 }}>{Story()}</div>],
} satisfies Meta<typeof SettingsFormContainer>

export default meta
type Story = StoryObj<typeof meta>

// the save button stays busy until the list is refetched
export const Loaded: Story = {
  ...connected(),
  play: async ({ canvas, step }) => {
    const field = await canvas.findByLabelText('Max tickets per order', {}, SLOW)

    await step('save a change', async () => {
      await userEvent.clear(field)
      await userEvent.type(field, '12')
      await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
      await waitFor(() => expect(canvas.getByRole('button', { name: 'Save' })).toHaveAttribute('aria-busy', 'true'))
    })

    await step('the refetched value stays', async () => {
      await waitFor(() => expect(canvas.getByRole('button', { name: 'Save' })).not.toHaveAttribute('aria-busy'), SLOW)
      await expect(canvas.getByLabelText('Max tickets per order')).toHaveValue(12)
      await expect(canvas.getByRole('button', { name: 'Save' })).toBeDisabled()
    })
  },
}

// the save conflicts with an edit made elsewhere; discard loads it
export const VersionConflict: Story = {
  ...connected({ concurrentEdit: (stored) => ({ ...stored, value: 20, version: stored.version + 1 }) }),
  play: async ({ canvas, step }) => {
    const field = await canvas.findByLabelText('Max tickets per order', {}, SLOW)

    await step('save over a newer version', async () => {
      await userEvent.clear(field)
      await userEvent.type(field, '12')
      await userEvent.click(canvas.getByRole('button', { name: 'Save' }))
      await expect(
        await canvas.findByText('Changed by someone else, discard to load the latest value', {}, SLOW),
      ).toBeInTheDocument()
    })

    await step('discard loads the newer version', async () => {
      await userEvent.click(canvas.getByRole('button', { name: 'Discard' }))
      await waitFor(() => expect(canvas.getByLabelText('Max tickets per order')).toHaveValue(20))
    })
  },
}

// every save fails with a 503, retried twice before the error shows on the field
export const SaveServerDown: Story = {
  ...connected({ failPut: 503 }),
  play: async ({ canvas }) => {
    const field = await canvas.findByLabelText('Support email', {}, SLOW)
    await userEvent.type(field, '.org')
    await userEvent.click(canvas.getByRole('button', { name: 'Save' }))

    await expect(await canvas.findByText('Internal server error', {}, SLOW)).toBeInTheDocument()
    await expect(canvas.getByRole('alert')).toHaveTextContent('1 of 1 changes could not be saved')
  },
}

// loading fails with a 503, retried three times before the error shows
export const LoadServerDown: Story = {
  ...connected({ failGet: 503 }),
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('alert', {}, SLOW)).toHaveTextContent('Internal server error')
    await expect(canvas.getByRole('button', { name: 'Retry' })).toBeEnabled()
  },
}

export const Loading: Story = {
  ...connected({ latency: { get: 'infinite' } }),
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar', { name: 'Loading settings' })).toBeInTheDocument()
  },
}
