import { describe, expect, it, vi } from 'vitest'
import MenuItem from '@mui/material/MenuItem'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Select } from './Select'

describe('Select', () => {
  it('lets the user pick an option', async () => {
    const onChange = vi.fn()
    const { user } = renderWithTheme(
      <Select defaultValue="a" onChange={onChange}>
        <MenuItem value="a">Apple</MenuItem>
        <MenuItem value="b">Banana</MenuItem>
      </Select>,
    )

    await user.click(screen.getByRole('combobox'))
    await user.click(await screen.findByRole('option', { name: 'Banana' }))

    expect(onChange).toHaveBeenCalledOnce()
    expect(screen.getByRole('combobox')).toHaveTextContent('Banana')
  })
})
