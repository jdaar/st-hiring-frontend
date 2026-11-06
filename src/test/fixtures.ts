import { Event, Setting, createFailureResponse, createSuccessResponse } from '@st-hiring/shared'

export const makeEvent = (id: number, overrides: Partial<Event> = {}): Event => ({
  id,
  name: `Event ${id}`,
  date: new Date('2026-12-01T20:00:00.000Z'),
  location: 'Madrid',
  description: `Description ${id}`,
  ticketTypes: [
    {
      type: 'general',
      faceValuePrice: '10.0000',
      serviceFeePrice: '1.5000',
      statusCounts: { available: 3, sold: 1, reserved: 0 },
    },
  ],
  createdAt: new Date('2026-11-01T10:00:00.000Z'),
  updatedAt: new Date('2026-11-01T10:00:00.000Z'),
  ...overrides,
})

export const makeSetting = (id: string, overrides: Partial<Setting> = {}): Setting => ({
  id,
  value: `${id}-value`,
  version: 1,
  createdAt: new Date('2026-11-01T10:00:00.000Z'),
  updatedAt: new Date('2026-11-01T10:00:00.000Z'),
  ...overrides,
})

export const success = createSuccessResponse

export const failure = (code: number, message: string) => createFailureResponse({ code, message })
