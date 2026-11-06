import { describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { makeEvent } from '../../../test/fixtures'
import { EventSummary } from './EventSummary'

const event = makeEvent(1, {
  name: 'Foy Vance',
  location: 'Great American Music Hall',
  ticketTypes: [
    { type: 'Week of show', faceValuePrice: '40.0000', serviceFeePrice: '11.4100', statusCounts: { available: 12, sold: 3, reserved: 1 } },
    { type: 'VIP', faceValuePrice: '95.5000', serviceFeePrice: '15.0000', statusCounts: { available: 0, sold: 20, reserved: 0 } },
  ],
})

const rowFor = (type: string) => screen.getByRole('rowheader', { name: type }).closest('tr') as HTMLElement

describe('EventSummary', () => {
  it('shows the event name as a heading, when and where it happens', () => {
    renderWithTheme(<EventSummary event={event} />)

    expect(screen.getByRole('heading', { level: 3, name: 'Foy Vance' })).toBeInTheDocument()
    expect(screen.getByText('Great American Music Hall')).toBeInTheDocument()
    expect(screen.getByText(/^Tuesday, Dec 01, 2026 · /)).toHaveAttribute('datetime', '2026-12-01T20:00:00.000Z')
  })

  it('lists every ticket type in a table with its column headers', () => {
    renderWithTheme(<EventSummary event={event} />)
    const table = screen.getByRole('table', { name: 'Foy Vance tickets' })

    expect(within(table).getAllByRole('columnheader').map((header) => header.textContent)).toEqual([
      'Ticket Type',
      'Price per Ticket',
      'Availability',
    ])
    expect(within(table).getAllByRole('rowheader').map((cell) => cell.textContent)).toEqual(['Week of show', 'VIP'])
  })

  it('shows the total price with its face value and service fee breakdown', () => {
    renderWithTheme(<EventSummary event={event} />)
    const row = within(rowFor('Week of show'))

    expect(row.getByText('$51.41')).toBeInTheDocument()
    expect(row.getByText('($40.00 face value + $11.41 service fee)')).toBeInTheDocument()
    expect(row.getByText('12 available')).toBeInTheDocument()
  })

  it('marks sold out ticket types', () => {
    renderWithTheme(<EventSummary event={event} />)
    const row = within(rowFor('VIP'))

    expect(row.getByText('$110.50')).toBeInTheDocument()
    expect(row.getByText('Sold out')).toBeInTheDocument()
  })

  it('says when nothing is on sale yet', () => {
    renderWithTheme(<EventSummary event={makeEvent(2, { ticketTypes: [] })} />)

    expect(screen.getByText('No tickets on sale yet.')).toBeInTheDocument()
    expect(screen.queryByRole('table')).not.toBeInTheDocument()
  })
})
