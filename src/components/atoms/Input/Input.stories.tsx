import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Input } from './Input'

const meta = {
  title: 'Atoms/Input',
  component: Input,
  args: { placeholder: 'Type something', onChange: fn() },
  argTypes: {
    type: { control: 'select', options: ['text', 'number', 'email', 'password'] },
    size: { control: 'inline-radio', options: ['small', 'medium'] },
  },
} satisfies Meta<typeof Input>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Numeric: Story = { args: { type: 'number', defaultValue: 10 } }

export const Invalid: Story = { args: { error: true, defaultValue: 'invalid' } }

export const Disabled: Story = { args: { disabled: true, defaultValue: 'read only' } }

export const FullWidth: Story = { args: { fullWidth: true } }
