import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { LabeledSwitch } from './LabeledSwitch'

describe('LabeledSwitch', () => {
  it('is reachable through its label and described by its helper text', async () => {
    const { user } = renderWithTheme(<LabeledSwitch label="Sales open" helperText="Customers can buy tickets" />)
    const toggle = screen.getByRole('checkbox', { name: 'Sales open' })

    expect(toggle).toHaveAccessibleDescription('Customers can buy tickets')

    await user.click(screen.getByText('Sales open'))
    expect(toggle).toBeChecked()
  })

  it('shows the error message instead of the helper text', () => {
    renderWithTheme(<LabeledSwitch label="Sales open" helperText="Customers can buy tickets" error="Could not be saved" />)

    expect(screen.getByRole('checkbox', { name: 'Sales open' })).toHaveAccessibleDescription('Could not be saved')
    expect(screen.queryByText('Customers can buy tickets')).not.toBeInTheDocument()
  })

  it('cannot be toggled when disabled', () => {
    renderWithTheme(<LabeledSwitch label="Sales open" disabled />)

    expect(screen.getByRole('checkbox', { name: 'Sales open' })).toBeDisabled()
  })
})
