import type { Meta, StoryObj } from '@storybook/react-vite'
import { Title } from './Title'

const meta = {
  title: 'Atoms/Title',
  component: Title,
  args: { children: 'Upcoming events', level: 1 },
  argTypes: {
    level: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
    variant: { control: 'select', options: [undefined, 'h1', 'h2', 'h3', 'h4', 'h5', 'h6'] },
  },
} satisfies Meta<typeof Title>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const AllLevels: Story = {
  render: (args) => (
    <>
      {([1, 2, 3, 4, 5, 6] as const).map((level) => (
        <Title key={level} {...args} level={level}>
          Heading level {level}
        </Title>
      ))}
    </>
  ),
}

// semantic h2 that looks like an h5
export const LooksDifferentFromItsLevel: Story = { args: { level: 2, variant: 'h5' } }
