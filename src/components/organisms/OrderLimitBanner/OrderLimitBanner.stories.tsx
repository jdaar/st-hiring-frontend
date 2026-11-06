import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { OrderLimitBanner } from './OrderLimitBanner'

const meta = {
  title: 'Organisms/OrderLimitBanner',
  component: OrderLimitBanner,
  args: { maxTickets: 5 },
  argTypes: { maxTickets: { control: { type: 'number', min: 1 } } },
} satisfies Meta<typeof OrderLimitBanner>

export default meta
type Story = StoryObj<typeof meta>

export const SeveralTickets: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Only 5 tickets can be purchased in the same order')
  },
}

export const OneTicket: Story = {
  args: { maxTickets: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Only 1 ticket can be purchased in the same order')
  },
}
