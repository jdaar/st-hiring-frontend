import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { createSettingsBackend } from '../../../test/handlers'
import { makeSetting } from '../../../test/fixtures'
import { OrderLimitBannerContainer } from './OrderLimitBannerContainer'

// fetched through the settings query and read back from the redux copy
const connected = (value: number) => {
  const backend = createSettingsBackend([makeSetting('maxTicketsPerOrder', { value })], { latency: { get: 400 } })
  return { parameters: { msw: { handlers: backend.handlers } }, beforeEach: backend.reset }
}

const meta = {
  title: 'Organisms/OrderLimitBanner/Connected',
  component: OrderLimitBannerContainer,
} satisfies Meta<typeof OrderLimitBannerContainer>

export default meta
type Story = StoryObj<typeof meta>

export const FromSettings: Story = {
  ...connected(8),
  play: async ({ canvas }) => {
    await expect(await canvas.findByRole('alert', {}, { timeout: 5_000 })).toHaveTextContent(
      'Only 8 tickets can be purchased in the same order',
    )
  },
}
