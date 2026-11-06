import type { Meta, StoryObj } from '@storybook/react-vite'
import { Markdown } from './Markdown'

const meta = {
  title: 'Atoms/Markdown',
  component: Markdown,
  args: {
    children: [
      '## World Tour 2026',
      'Doors open **one hour** before the show. Tickets are *non-refundable*.',
      '- All ages\n- Standing room only',
      '![Stage](https://picsum.photos/seed/stage/480/320)',
    ].join('\n\n'),
    size: 'sm',
  },
  argTypes: {
    size: { control: 'inline-radio', options: ['lg', 'md', 'sm'] },
    headingLevel: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] },
  },
} satisfies Meta<typeof Markdown>

export default meta
type Story = StoryObj<typeof meta>

export const Description: Story = {}

export const PlainText: Story = { args: { children: 'Hello **world**' } }
