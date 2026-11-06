import type { Meta, StoryObj } from '@storybook/react-vite'
import MenuItem from '@mui/material/MenuItem'
import { expect, fn } from 'storybook/test'
import { pickOption, setupUser } from '../../../test/interactions'
import { Select } from './Select'

const meta = {
  title: 'Atoms/Select',
  component: Select,
  args: { defaultValue: 'text', onChange: fn(), inputProps: { 'aria-label': 'Type' }, sx: { minWidth: 200 } },
  render: (args) => (
    <Select {...args}>
      <MenuItem value="text">Text</MenuItem>
      <MenuItem value="number">Number</MenuItem>
      <MenuItem value="boolean">On / off</MenuItem>
    </Select>
  ),
} satisfies Meta<typeof Select>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, args }) => {
    await pickOption(setupUser(), canvas.getByRole('combobox'), 'Number')

    await expect(args.onChange).toHaveBeenCalled()
    await expect(canvas.getByRole('combobox')).toHaveTextContent('Number')
  },
}

export const Disabled: Story = { args: { disabled: true } }
