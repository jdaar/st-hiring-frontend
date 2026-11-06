import type { Meta, StoryObj } from '@storybook/react-vite'
import { Paragraph } from './Paragraph'

const meta = {
  title: 'Atoms/Paragraph',
  component: Paragraph,
  args: {
    children: 'Doors open one hour before the show. Tickets are non-refundable but can be transferred.',
    size: 'md',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['lg', 'md', 'sm'] },
    color: { control: 'select', options: ['text.primary', 'text.secondary', 'error', 'primary'] },
  },
} satisfies Meta<typeof Paragraph>

export default meta
type Story = StoryObj<typeof meta>

export const Large: Story = { args: { size: 'lg' } }

export const Medium: Story = {}

export const Small: Story = { args: { size: 'sm' } }

export const Secondary: Story = { args: { color: 'text.secondary' } }
