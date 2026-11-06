import { forwardRef } from 'react'
import Typography, { TypographyProps } from '@mui/material/Typography'

export type ParagraphProps = Omit<TypographyProps, 'component' | 'variant'> & {
  size?: 'md' | 'sm'
}

export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(({ size = 'md', ...props }, ref) => (
  <Typography ref={ref} component="p" variant={size === 'md' ? 'body1' : 'body2'} {...props} />
))

Paragraph.displayName = 'Paragraph'
