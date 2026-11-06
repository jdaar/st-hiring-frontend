import { forwardRef } from 'react'
import Typography, { TypographyProps } from '@mui/material/Typography'

const VARIANTS = { lg: 'subtitle1', md: 'body1', sm: 'body2' } as const

export type ParagraphProps = Omit<TypographyProps, 'component' | 'variant'> & {
  size?: keyof typeof VARIANTS
}

export const Paragraph = forwardRef<HTMLParagraphElement, ParagraphProps>(({ size = 'md', ...props }, ref) => (
  <Typography ref={ref} component="p" variant={VARIANTS[size]} {...props} />
))

Paragraph.displayName = 'Paragraph'
