import { forwardRef } from 'react'
import Stack from '@mui/material/Stack'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableContainer from '@mui/material/TableContainer'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import { Theme } from '@mui/material/styles'
import { Event } from '@st-hiring/shared'
import { capitalize, formatEventDate, formatPrice } from '../../../format'
import { Markdown, Paragraph, Title, TitleLevel } from '../../atoms'
import { Expandable } from '../Expandable'

export interface EventSummaryProps {
  event: Event
  titleLevel?: TitleLevel
}

// below sm each ticket row stacks: type and availability on top, price breakdown underneath;
// from sm up it is a plain table row with the theme's padding and dividers
const stackedRow = (theme: Theme) => ({
  [theme.breakpoints.down('sm')]: {
    display: 'grid',
    gridTemplateAreas: '"type availability" "price price"',
    gridTemplateColumns: '1fr auto',
    columnGap: theme.spacing(2),
    '& > .MuiTableCell-root': { display: 'block', borderBottom: 0 },
    '& > .MuiTableCell-root:nth-of-type(2)': { paddingTop: 0 },
    '&:not(:last-of-type)': { borderBottom: `1px solid ${theme.palette.divider}` },
  },
})

// event header followed by every ticket type with its price breakdown
export const EventSummary = forwardRef<HTMLDivElement, EventSummaryProps>(({ event, titleLevel = 3 }, ref) => (
  <Stack ref={ref} spacing={2} sx={{ width: '100%' }}>
    <Stack spacing={0.5}>
      <Title level={titleLevel} variant="h6">
        {event.name}
      </Title>
      <Paragraph size="sm" color="text.secondary">
        <time dateTime={event.date.toISOString()}>{formatEventDate(event.date)}</time>
      </Paragraph>
      <Paragraph size="sm" color="text.secondary">
        {event.location}
      </Paragraph>
    </Stack>

    {event.description && (
      <Expandable>
        <Markdown headingLevel={Math.min(titleLevel + 1, 6) as TitleLevel}>{event.description}</Markdown>
      </Expandable>
    )}

    {event.ticketTypes.length === 0 ? (
      <Paragraph size="sm" color="text.secondary">
        No tickets on sale yet.
      </Paragraph>
    ) : (
      <TableContainer>
        <Table aria-label={`${event.name} tickets`}>
          <TableHead sx={{ display: { xs: 'none', sm: 'table-header-group' } }}>
            <TableRow>
              <TableCell>Ticket Type</TableCell>
              <TableCell>Price per Ticket</TableCell>
              <TableCell align="right">Availability</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {event.ticketTypes.map(({ type, faceValuePrice, serviceFeePrice, statusCounts }) => (
              <TableRow key={type} sx={stackedRow}>
                <TableCell component="th" scope="row" sx={{ gridArea: 'type' }}>
                  <Paragraph fontWeight={500}>{capitalize(type)}</Paragraph>
                </TableCell>
                <TableCell sx={{ gridArea: 'price' }}>
                  <Paragraph size="lg" fontWeight={600}>
                    {formatPrice(faceValuePrice, serviceFeePrice)}
                  </Paragraph>
                  <Paragraph size="sm" color="text.secondary">
                    ({formatPrice(faceValuePrice)} face value + {formatPrice(serviceFeePrice)} service fee)
                  </Paragraph>
                </TableCell>
                <TableCell align="right" sx={{ gridArea: 'availability' }}>
                  <Paragraph size="sm">
                    {statusCounts.available > 0 ? `${statusCounts.available} available` : 'Sold out'}
                  </Paragraph>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    )}
  </Stack>
))

EventSummary.displayName = 'EventSummary'
