import type { Meta, StoryObj } from '@storybook/react-vite'
import { expect, fn, userEvent, within } from 'storybook/test'
import { Event } from '@st-hiring/shared'
import { makeEvent } from '../../../test/fixtures'
import { EventSummary } from '../../molecules'
import { PaginatedList } from './PaginatedList'

const EventList = PaginatedList<Event>

const events = Array.from({ length: 5 }, (_, index) => makeEvent(index + 1))

const meta = {
  title: 'Organisms/PaginatedList',
  component: EventList,
  args: {
    title: 'Upcoming events',
    subheader: '42 events',
    items: events,
    getKey: (event) => event.id,
    renderItem: (event) => <EventSummary event={event} />,
    page: 1,
    totalPages: 9,
    onPageChange: fn(),
    onRetry: fn(),
  },
  parameters: { layout: 'padded' },
} satisfies Meta<typeof EventList>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, args }) => {
    await expect(within(canvas.getByRole('list', { name: 'Upcoming events' })).getAllByRole('listitem')).toHaveLength(5)

    await userEvent.click(canvas.getByRole('button', { name: 'Go to page 2' }))
    await expect(args.onPageChange).toHaveBeenCalledWith(2)

    await userEvent.click(canvas.getByRole('button', { name: 'Go to next page' }))
    await expect(args.onPageChange).toHaveBeenLastCalledWith(2)
  },
}

// previous page stays visible, marked busy, while the next one loads
export const Updating: Story = {
  args: { updating: true, page: 2 },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar', { name: 'Loading page' })).toBeInTheDocument()
    await expect(canvas.getByRole('list', { name: 'Upcoming events' })).toHaveAttribute('aria-busy', 'true')
  },
}

export const SinglePage: Story = {
  args: { totalPages: 1 },
  play: async ({ canvas }) => {
    await expect(canvas.queryByRole('navigation')).not.toBeInTheDocument()
  },
}

export const Empty: Story = {
  args: { items: [], totalPages: 0, emptyText: 'No upcoming events.' },
  play: async ({ canvas }) => {
    await expect(canvas.getByText('No upcoming events.')).toBeInTheDocument()
  },
}

export const Loading: Story = {
  args: { loading: true },
  play: async ({ canvas }) => {
    await expect(canvas.getByRole('progressbar', { name: 'Loading' })).toBeInTheDocument()
    await expect(canvas.queryByRole('list', { name: 'Upcoming events' })).not.toBeInTheDocument()
  },
}

export const Failed: Story = {
  args: { error: 'Internal server error' },
  play: async ({ canvas, args }) => {
    await expect(canvas.getByRole('alert')).toHaveTextContent('Internal server error')

    await userEvent.click(canvas.getByRole('button', { name: 'Retry' }))
    await expect(args.onRetry).toHaveBeenCalledOnce()
  },
}
