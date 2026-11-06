import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn } from 'storybook/test'
import { LabeledSelect } from './LabeledSelect'

const meta = {
  title: 'Molecules/LabeledSelect',
  component: LabeledSelect,
  args: {
    label: 'Type',
    defaultValue: 'text',
    helperText: 'Decides which input the value gets',
    options: [
      { value: 'text', label: 'Text' },
      { value: 'number', label: 'Number' },
      { value: 'boolean', label: 'On / off' },
    ],
    onChange: fn(),
    sx: { minWidth: 240 },
  },
} satisfies Meta<typeof LabeledSelect>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('combobox', { name: 'Type' })).toHaveAccessibleDescription(
      'Decides which input the value gets',
    )
  },
}

export const WithErrorMessage: Story = { args: { error: 'Pick a type' } }

export const Disabled: Story = { args: { disabled: true } }
