import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect } from 'storybook/test'
import { ProgressBar } from './ProgressBar'

const meta = {
  title: 'Atoms/ProgressBar',
  component: ProgressBar,
  args: { 'aria-label': 'Loading' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['indeterminate', 'determinate', 'buffer', 'query'] },
    value: { control: { type: 'range', min: 0, max: 100 } },
  },
} satisfies Meta<typeof ProgressBar>

export default meta
type Story = StoryObj<typeof meta>

export const Indeterminate: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar', { name: 'Loading' })).not.toHaveAttribute('aria-valuenow')
  },
}

export const Determinate: Story = { args: { variant: 'determinate', value: 60 } }
