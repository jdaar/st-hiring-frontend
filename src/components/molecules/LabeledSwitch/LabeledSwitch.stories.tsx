import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { LabeledSwitch } from './LabeledSwitch'

const meta = {
  title: 'Molecules/LabeledSwitch',
  component: LabeledSwitch,
  args: { label: 'Sales open', helperText: 'Customers can buy tickets', onChange: fn() },
} satisfies Meta<typeof LabeledSwitch>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Checked: Story = { args: { defaultChecked: true } }

export const WithErrorMessage: Story = { args: { error: 'Could not be saved' } }

export const Disabled: Story = { args: { disabled: true } }
