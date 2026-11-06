import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Switch } from './Switch'

const meta = {
  title: 'Atoms/Switch',
  component: Switch,
  args: { onChange: fn(), inputProps: { 'aria-label': 'Sales open' } },
  argTypes: {
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'error', 'info', 'warning', 'default'] },
    size: { control: 'inline-radio', options: ['small', 'medium'] },
  },
} satisfies Meta<typeof Switch>

export default meta
type Story = StoryObj<typeof meta>

export const Off: Story = {}

export const On: Story = { args: { defaultChecked: true } }

export const Disabled: Story = { args: { disabled: true, defaultChecked: true } }
