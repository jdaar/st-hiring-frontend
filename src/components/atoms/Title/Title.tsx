import { forwardRef } from 'react'
import Typography, { TypographyProps } from '@mui/material/Typography'

export type TitleLevel = 1 | 2 | 3 | 4 | 5 | 6

export type TitleProps = Omit<TypographyProps, 'component'> & {
  // semantic heading level; also the default look unless variant is set
  level?: TitleLevel
}

export const Title = forwardRef<HTMLHeadingElement, TitleProps>(({ level = 1, variant, ...props }, ref) => (
  <Typography ref={ref} component={`h${level}`} variant={variant ?? `h${level}`} {...props} />
))

Title.displayName = 'Title'
