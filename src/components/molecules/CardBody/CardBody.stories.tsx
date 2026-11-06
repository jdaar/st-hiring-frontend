import type { Meta, StoryObj } from '@storybook/react-vite'
import { Paragraph } from '../../atoms'
import { LabeledInput } from '../LabeledInput'
import { CardBody } from './CardBody'

const meta = {
  title: 'Molecules/CardBody',
  component: CardBody,
  args: { spacing: 2 },
  argTypes: { spacing: { control: { type: 'range', min: 0, max: 6 } } },
} satisfies Meta<typeof CardBody>

export default meta
type Story = StoryObj<typeof meta>

export const Text: Story = {
  args: {
    children: [
      <Paragraph key="1">Doors open one hour before the show.</Paragraph>,
      <Paragraph key="2" size="sm" color="text.secondary">
        Tickets can be transferred but not refunded.
      </Paragraph>,
    ],
  },
}

export const Fields: Story = {
  args: {
    children: [
      <LabeledInput key="1" label="Max tickets per order" type="number" fullWidth />,
      <LabeledInput key="2" label="Support email" type="email" fullWidth />,
    ],
  },
}
