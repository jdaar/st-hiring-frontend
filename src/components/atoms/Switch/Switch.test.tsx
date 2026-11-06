import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Switch } from './Switch'

describe('Switch', () => {
  it('toggles and reports the new state', async () => {
    const onChange = vi.fn()
    const { user } = renderWithTheme(<Switch inputProps={{ 'aria-label': 'Sales open' }} onChange={onChange} />)
    const toggle = screen.getByRole('checkbox', { name: 'Sales open' })

    await user.click(toggle)

    expect(toggle).toBeChecked()
    expect(onChange).toHaveBeenCalledWith(expect.anything(), true)
  })
})
