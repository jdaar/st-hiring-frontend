import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Input } from './Input'

describe('Input', () => {
  it('reports what the user types', async () => {
    const onChange = vi.fn()
    const { user } = renderWithTheme(<Input inputProps={{ 'aria-label': 'name' }} onChange={onChange} />)

    await user.type(screen.getByRole('textbox', { name: 'name' }), 'Ada')

    expect(screen.getByRole('textbox')).toHaveValue('Ada')
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('is marked invalid on error', () => {
    renderWithTheme(<Input error inputProps={{ 'aria-label': 'name' }} />)

    expect(screen.getByRole('textbox')).toHaveAttribute('aria-invalid', 'true')
  })

  it('cannot be edited when disabled', () => {
    renderWithTheme(<Input disabled inputProps={{ 'aria-label': 'name' }} />)

    expect(screen.getByRole('textbox')).toBeDisabled()
  })
})
