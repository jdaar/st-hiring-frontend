import { describe, expect, it } from 'vitest'
import { makeSetting } from '../test/fixtures'
import { selectMaxTicketsPerOrder, settingsReceived, settingsSlice } from './settings.slice'

const withValues = (values: Record<string, string | number | boolean>) => ({ settings: { values } })

describe('settings slice', () => {
  it('replaces the local copy with the received values', () => {
    const state = settingsSlice.reducer(
      { values: { removed: true } },
      settingsReceived([makeSetting('maxTicketsPerOrder', { value: 5 }), makeSetting('salesOpen', { value: false })]),
    )

    expect(state).toEqual({ values: { maxTicketsPerOrder: 5, salesOpen: false } })
  })

  it.each([
    [5, 5],
    ['7', 7],
  ])('reads %j as an order limit of %d', (value, limit) => {
    expect(selectMaxTicketsPerOrder(withValues({ maxTicketsPerOrder: value }))).toBe(limit)
  })

  it.each([0, -2, 2.5, 'many', true])('ignores %j as an order limit', (value) => {
    expect(selectMaxTicketsPerOrder(withValues({ maxTicketsPerOrder: value }))).toBeUndefined()
  })

  it('has no order limit without the setting', () => {
    expect(selectMaxTicketsPerOrder(withValues({}))).toBeUndefined()
  })
})
