import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from './Button'

const meta = {
  title: 'Atoms/Button',
  component: Button,
  args: { children: 'Save', variant: 'contained', onClick: fn() },
  argTypes: {
    variant: { control: 'inline-radio', options: ['contained', 'outlined', 'text'] },
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'error', 'info', 'warning', 'inherit'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Contained: Story = {}

export const Outlined: Story = { args: { variant: 'outlined' } }

export const TextOnly: Story = { args: { variant: 'text' } }

export const Loading: Story = { args: { loading: true } }

export const Disabled: Story = { args: { disabled: true } }
