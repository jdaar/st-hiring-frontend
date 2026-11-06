import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, spyOn, userEvent, within } from 'storybook/test'
import { makeEvent } from '../../../test/fixtures'
import { EventSummary } from './EventSummary'

const meta = {
  title: 'Molecules/EventSummary',
  component: EventSummary,
  args: {
    event: makeEvent(1, {
      name: 'Foy Vance',
      location: 'Great American Music Hall · San Francisco, CA',
      description: '**World Tour** 2026 & 2027\n\n- Doors 6 pm\n- Show 7 pm',
      ticketTypes: [
        {
          type: 'Advance',
          faceValuePrice: '36.0000',
          serviceFeePrice: '10.2700',
          statusCounts: { available: 0, sold: 200, reserved: 0 },
        },
        {
          type: 'Week of show: general admission',
          faceValuePrice: '40.0000',
          serviceFeePrice: '11.4100',
          statusCounts: { available: 84, sold: 30, reserved: 6 },
        },
        {
          type: 'Door',
          faceValuePrice: '45.0000',
          serviceFeePrice: '12.8300',
          statusCounts: { available: 150, sold: 0, reserved: 0 },
        },
      ],
    }),
  },
  argTypes: { titleLevel: { control: 'inline-radio', options: [1, 2, 3, 4, 5, 6] } },
  decorators: [(Story) => <div style={{ maxWidth: 880 }}>{Story()}</div>],
} satisfies Meta<typeof EventSummary>

export default meta
type Story = StoryObj<typeof meta>

export const TicketTypes: Story = {
  play: async ({ canvas }) => {
    const table = canvas.getByRole('table', { name: 'Foy Vance tickets' })
    await expect(within(table).getAllByRole('rowheader')).toHaveLength(3)

    const row = within(
      canvas.getByRole('rowheader', { name: 'Week of show: general admission' }).closest('tr') as HTMLElement,
    )
    await expect(row.getByText('$51.41')).toBeInTheDocument()
    await expect(row.getByText('($40.00 face value + $11.41 service fee)')).toBeInTheDocument()
    await expect(row.getByText('84 available')).toBeInTheDocument()
  },
}

export const SingleTicketType: Story = { args: { event: makeEvent(2, { name: 'Rock night' }) } }

export const NothingOnSale: Story = {
  args: { event: makeEvent(3, { name: 'Announced soon', ticketTypes: [] }) },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No tickets on sale yet.')).toBeInTheDocument()
  },
}

export const LongDescription: Story = {
  args: {
    event: makeEvent(3, {
      name: 'Jazz night',
      description: [
        '## Lineup',
        'An evening of **live jazz** with a *surprise* guest.',
        '- Doors 7 pm\n- Show 8 pm\n- Late bar until 1 am',
        '![Stage](https://picsum.photos/seed/jazz/480/320)',
      ].join('\n\n'),
    }),
  },
  // jsdom has no layout, so the description is pinned taller than its collapsed height
  beforeEach: () => {
    const spy = spyOn(HTMLElement.prototype, 'scrollHeight', 'get').mockReturnValue(600)
    return () => spy.mockRestore()
  },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('heading', { level: 5, name: 'Lineup' })).toBeInTheDocument()

    await userEvent.click(canvas.getByRole('button', { name: 'More...' }))
    await expect(canvas.getByRole('button', { name: 'Less' })).toHaveAttribute('aria-expanded', 'true')
  },
}
