import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { Banner } from './Banner'

const meta = {
  title: 'Atoms/Banner',
  component: Banner,
  args: { children: 'Only 5 tickets can be purchased in the same order' },
  argTypes: {
    severity: { control: 'inline-radio', options: ['info', 'success', 'warning', 'error'] },
    variant: { control: 'inline-radio', options: ['standard', 'outlined', 'filled'] },
  },
} satisfies Meta<typeof Banner>

export default meta
type Story = StoryObj<typeof meta>

export const Info: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Only 5 tickets can be purchased in the same order')
  },
}

export const WithTitle: Story = {
  args: { title: 'Order limit' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('Order limit')).toBeInTheDocument()
  },
}
