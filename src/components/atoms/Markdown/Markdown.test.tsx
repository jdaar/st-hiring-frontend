import { describe, expect, it } from 'vitest'
import { screen } from '@testing-library/react'
import { renderWithTheme } from '../../../test/render'
import { Markdown } from './Markdown'

describe('Markdown', () => {
  it('renders emphasis inside a paragraph', () => {
    renderWithTheme(<Markdown>{'Hello **world** and *you*'}</Markdown>)

    expect(screen.getByText('world')).toHaveProperty('tagName', 'STRONG')
    expect(screen.getByText('you')).toHaveProperty('tagName', 'EM')
    expect(screen.getByText(/^Hello/)).toHaveClass('MuiTypography-body2')
  })

  it('renders lists', () => {
    renderWithTheme(<Markdown>{'- First item\n- Second item'}</Markdown>)

    expect(screen.getAllByRole('listitem').map((item) => item.textContent)).toEqual(['First item', 'Second item'])
  })

  it('nests headings under the given level', () => {
    renderWithTheme(<Markdown headingLevel={3}>{'# Lineup\n\n## Openers'}</Markdown>)

    expect(screen.getByRole('heading', { level: 3, name: 'Lineup' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { level: 4, name: 'Openers' })).toBeInTheDocument()
  })

  it('caps headings at level 6', () => {
    renderWithTheme(<Markdown headingLevel={5}>{'### Deep'}</Markdown>)

    expect(screen.getByRole('heading', { level: 6, name: 'Deep' })).toBeInTheDocument()
  })

  it('renders images and links', () => {
    renderWithTheme(
      <Markdown>{'![Stage](https://picsum.photos/seed/a/400/300) [Venue](https://example.com)'}</Markdown>,
    )

    expect(screen.getByRole('img', { name: 'Stage' })).toHaveAttribute('src', 'https://picsum.photos/seed/a/400/300')
    expect(screen.getByRole('link', { name: 'Venue' })).toHaveAttribute('href', 'https://example.com')
  })

  it('skips raw html', () => {
    renderWithTheme(<Markdown>{'Safe <b>bold</b>\n\n<script>alert(1)</script>'}</Markdown>)

    expect(document.body.querySelector('b, script')).toBeNull()
  })

  it('drops javascript urls', () => {
    renderWithTheme(<Markdown>{'[click](javascript:alert(1))'}</Markdown>)

    expect(screen.getByText('click')).not.toHaveAttribute('href', expect.stringContaining('javascript'))
  })
})
