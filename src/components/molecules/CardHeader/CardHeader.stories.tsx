import type { Meta, StoryObj } from '@storybook/react-vite'
import { fn } from 'storybook/test'
import { Button } from '../../atoms'
import { CardHeader } from './CardHeader'

const meta = {
  title: 'Molecules/CardHeader',
  component: CardHeader,
  args: { title: 'Settings', subheader: 'Changes apply to every new order', titleLevel: 2 },
  argTypes: { titleLevel: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] } },
} satisfies Meta<typeof CardHeader>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const TitleOnly: Story = { args: { subheader: undefined } }

export const WithAction: Story = {
  args: {
    action: (
      <Button size="small" onClick={fn()}>
        Refresh
      </Button>
    ),
  },
}
