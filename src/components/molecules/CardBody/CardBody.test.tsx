import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Paragraph } from '../../atoms'
import { CardBody } from './CardBody'

describe('CardBody', () => {
  it('renders its children in order', () => {
    renderWithTheme(
      <CardBody>
        <Paragraph>First</Paragraph>
        <Paragraph>Second</Paragraph>
      </CardBody>,
    )

    expect(screen.getAllByText(/First|Second/).map((node) => node.textContent)).toEqual(['First', 'Second'])
  })
})
