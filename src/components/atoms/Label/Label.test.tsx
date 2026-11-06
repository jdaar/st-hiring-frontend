import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Label } from './Label'

describe('Label', () => {
  it('labels the element it points at', () => {
    renderWithTheme(
      <>
        <Label htmlFor="name">Name</Label>
        <input id="name" />
      </>,
    )

    expect(screen.getByLabelText('Name')).toBe(document.getElementById('name'))
  })

  it('marks required fields', () => {
    renderWithTheme(<Label required>Name</Label>)

    expect(screen.getByText('Name').closest('label')).toHaveTextContent('Name *')
  })
})
