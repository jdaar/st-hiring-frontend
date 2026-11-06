import type { ChangeEvent } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'
import { useArgs } from 'storybook/preview-api'
import { fn } from 'storybook/test'
import { LabeledInput } from './LabeledInput'

const meta = {
  title: 'Molecules/LabeledInput',
  component: LabeledInput,
  args: { label: 'Max tickets per order', helperText: 'Between 1 and 20', onChange: fn() },
  argTypes: {
    type: { control: 'select', options: ['text', 'number', 'email', 'password'] },
    size: { control: 'inline-radio', options: ['small', 'medium'] },
  },
} satisfies Meta<typeof LabeledInput>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const Required: Story = { args: { required: true } }

export const WithErrorMessage: Story = { args: { error: 'Must be at most 20', defaultValue: 25, type: 'number' } }

export const Disabled: Story = { args: { disabled: true, defaultValue: 10 } }

export const FullWidth: Story = { args: { fullWidth: true } }

// value lives in the story args, so typing updates the Controls panel too
export const Controlled: Story = {
  args: { value: '10', type: 'number' },
  render: function Render(args) {
    const [, updateArgs] = useArgs()
    return (
      <LabeledInput
        {...args}
        onChange={(event: ChangeEvent<HTMLInputElement>) => {
          args.onChange?.(event)
          updateArgs({ value: event.target.value })
        }}
      />
    )
  },
}
