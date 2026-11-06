import { forwardRef } from 'react'
import CardContent, { CardContentProps } from '@mui/material/CardContent'
import Stack from '@mui/material/Stack'

export type CardBodyProps = CardContentProps & {
  spacing?: number
}

// stacks its children (paragraphs, inputs...) with consistent spacing
export const CardBody = forwardRef<HTMLDivElement, CardBodyProps>(({ spacing = 2, children, ...props }, ref) => (
  <CardContent ref={ref} {...props}>
    <Stack spacing={spacing}>{children}</Stack>
  </CardContent>
))

CardBody.displayName = 'CardBody'
