import { describe, expect, it, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { LabeledInput } from './LabeledInput'

describe('LabeledInput', () => {
  it('is reachable through its label and described by its helper text', () => {
    renderWithTheme(<LabeledInput label="Max tickets" helperText="Between 1 and 20" />)

    expect(screen.getByLabelText('Max tickets')).toHaveAccessibleDescription('Between 1 and 20')
  })

  it('shows the error message instead of the helper text and is marked invalid', () => {
    renderWithTheme(<LabeledInput label="Max tickets" helperText="Between 1 and 20" error="Must be at most 20" />)
    const input = screen.getByLabelText('Max tickets')

    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(input).toHaveAccessibleDescription('Must be at most 20')
    expect(screen.queryByText('Between 1 and 20')).not.toBeInTheDocument()
  })

  it('passes required and disabled to the input', () => {
    renderWithTheme(<LabeledInput label="Max tickets" required disabled />)
    const input = screen.getByRole('textbox', { name: /Max tickets/ })

    expect(input).toBeRequired()
    expect(input).toBeDisabled()
  })

  it('reports what the user types', async () => {
    const onChange = vi.fn()
    const { user } = renderWithTheme(<LabeledInput label="Name" onChange={onChange} />)

    await user.type(screen.getByLabelText('Name'), 'Ada')

    expect(screen.getByLabelText('Name')).toHaveValue('Ada')
    expect(onChange).toHaveBeenCalledTimes(3)
  })

  it('keeps an explicit id', () => {
    renderWithTheme(<LabeledInput id="max-tickets" label="Max tickets" />)

    expect(screen.getByLabelText('Max tickets')).toHaveAttribute('id', 'max-tickets')
  })
})
