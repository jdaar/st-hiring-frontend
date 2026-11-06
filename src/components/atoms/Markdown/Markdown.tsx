import { ReactNode, useMemo } from 'react'
import ReactMarkdown, { Components } from 'react-markdown'
import Box from '@mui/material/Box'
import Link from '@mui/material/Link'
import Typography from '@mui/material/Typography'
import { Paragraph, ParagraphProps } from '../Paragraph'
import { Title, TitleLevel } from '../Title'

export interface MarkdownProps {
  children: string
  size?: ParagraphProps['size']
  // semantic level of a markdown `#`, deeper headings follow it
  headingLevel?: TitleLevel
}

const heading =
  (base: TitleLevel, depth: number): Components['h1'] =>
  ({ children }) => (
    <Title level={Math.min(base + depth, 6) as TitleLevel} variant="subtitle1" fontWeight={600}>
      {children}
    </Title>
  )

const list =
  (component: 'ul' | 'ol') =>
  ({ children }: { children?: ReactNode }) => (
    <Box component={component} sx={{ my: 0, pl: 3 }}>
      {children}
    </Box>
  )

// raw html is skipped, so only markdown syntax reaches the dom, each node as its MUI counterpart
export const Markdown = ({ children, size = 'sm', headingLevel = 4 }: MarkdownProps) => {
  const components = useMemo<Components>(
    () => ({
      p: ({ children }) => <Paragraph size={size}>{children}</Paragraph>,
      a: ({ href, children }) => <Link href={href}>{children}</Link>,
      h1: heading(headingLevel, 0),
      h2: heading(headingLevel, 1),
      h3: heading(headingLevel, 2),
      h4: heading(headingLevel, 3),
      h5: heading(headingLevel, 4),
      h6: heading(headingLevel, 5),
      ul: list('ul'),
      ol: list('ol'),
      li: ({ children }) => (
        <Typography component="li" variant={size === 'sm' ? 'body2' : 'body1'}>
          {children}
        </Typography>
      ),
      img: ({ src, alt }) => (
        <Box
          component="img"
          src={src}
          alt={alt ?? ''}
          loading="lazy"
          sx={{ display: 'block', maxWidth: '100%', maxHeight: 512, height: 'auto', borderRadius: 1 }}
        />
      ),
    }),
    [size, headingLevel],
  )

  return (
    <Box sx={{ display: 'grid', gap: 1 }}>
      <ReactMarkdown skipHtml components={components}>
        {children}
      </ReactMarkdown>
    </Box>
  )
}
