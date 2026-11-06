import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { LabeledSelect } from './LabeledSelect'

const options = [
  { value: 'text', label: 'Text' },
  { value: 'number', label: 'Number' },
]

describe('LabeledSelect', () => {
  it('is named by its label and described by its helper text', () => {
    renderWithTheme(<LabeledSelect label="Type" defaultValue="text" options={options} helperText="Pick one" />)

    expect(screen.getByRole('combobox', { name: 'Type' })).toHaveAccessibleDescription('Pick one')
  })

  it('shows the error message instead of the helper text', () => {
    renderWithTheme(<LabeledSelect label="Type" defaultValue="text" options={options} helperText="Pick one" error="Required" />)

    expect(screen.getByRole('combobox', { name: 'Type' })).toHaveAccessibleDescription('Required')
    expect(screen.queryByText('Pick one')).not.toBeInTheDocument()
  })

  it('offers every option', async () => {
    const { user } = renderWithTheme(<LabeledSelect label="Type" defaultValue="text" options={options} />)

    await user.click(screen.getByRole('combobox', { name: 'Type' }))

    expect((await screen.findAllByRole('option')).map((option) => option.textContent)).toEqual(['Text', 'Number'])
  })
})
