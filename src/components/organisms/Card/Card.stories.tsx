import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button, Paragraph } from '../../atoms'
import { ButtonGroup, LabeledInput } from '../../molecules'
import { Card } from './Card'

const meta = {
  title: 'Organisms/Card',
  component: Card,
  args: { title: 'Rock night', subheader: 'Joplin · 9 Nov 2026', variant: 'outlined', sx: { maxWidth: 480 } },
  argTypes: {
    variant: { control: 'inline-radio', options: ['outlined', 'elevation'] },
    titleLevel: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
  },
} satisfies Meta<typeof Card>

export default meta
type Story = StoryObj<typeof meta>

export const Event: Story = {
  args: {
    children: <Paragraph>Live music all night. Doors open at 8 pm.</Paragraph>,
    actions: <Button onClick={fn()}>Get tickets</Button>,
  },
}

export const HeaderOnly: Story = {}

export const Form: Story = {
  args: {
    title: 'Settings',
    subheader: 'Changes apply to every new order',
    children: [
      <LabeledInput key="max" label="Max tickets per order" type="number" defaultValue={10} fullWidth />,
      <LabeledInput key="email" label="Support email" type="email" helperText="Shown on tickets" fullWidth />,
    ],
    actions: (
      <ButtonGroup aria-label="form actions">
        <Button variant="outlined" onClick={fn()}>
          Cancel
        </Button>
        <Button variant="contained" onClick={fn()}>
          Save
        </Button>
      </ButtonGroup>
    ),
  },
}
