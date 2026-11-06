import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '../../atoms'
import { ButtonGroup } from './ButtonGroup'

const meta = {
  title: 'Molecules/ButtonGroup',
  component: ButtonGroup,
  args: { 'aria-label': 'pagination', variant: 'outlined', orientation: 'horizontal' },
  argTypes: {
    variant: { control: 'inline-radio', options: ['contained', 'outlined', 'text'] },
    orientation: { control: 'inline-radio', options: ['horizontal', 'vertical'] },
    size: { control: 'inline-radio', options: ['small', 'medium', 'large'] },
    color: { control: 'select', options: ['primary', 'secondary', 'success', 'error', 'info', 'warning', 'inherit'] },
  },
  render: (args) => (
    <ButtonGroup {...args}>
      <Button onClick={fn()}>Previous</Button>
      <Button onClick={fn()}>1</Button>
      <Button onClick={fn()}>2</Button>
      <Button onClick={fn()}>Next</Button>
    </ButtonGroup>
  ),
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Outlined: Story = {}

export const Contained: Story = { args: { variant: 'contained' } }

export const Vertical: Story = { args: { orientation: 'vertical' } }

export const FullWidth: Story = { args: { fullWidth: true } }
