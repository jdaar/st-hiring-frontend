import type { Meta, StoryObj } from '@storybook/react-vite'
import { Label } from './Label'

const meta = {
  title: 'Atoms/Label',
  component: Label,
  args: { children: 'Max tickets per order', htmlFor: 'max-tickets' },
} satisfies Meta<typeof Label>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Required: Story = { args: { required: true } }

export const Invalid: Story = { args: { error: true } }

export const Disabled: Story = { args: { disabled: true } }
