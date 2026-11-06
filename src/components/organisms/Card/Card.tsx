import { ReactNode, forwardRef } from 'react'
import MuiCard, { CardProps as MuiCardProps } from '@mui/material/Card'
import CardActions from '@mui/material/CardActions'
import { CardBody, CardHeader, CardHeaderProps } from '../../molecules'

export type CardProps = Omit<MuiCardProps, 'title'> &
  Pick<CardHeaderProps, 'title' | 'subheader' | 'titleLevel'> & {
    headerAction?: ReactNode
    // e.g. a ButtonGroup, aligned to the end
    actions?: ReactNode
  }

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ title, subheader, titleLevel, headerAction, actions, children, ...props }, ref) => (
    <MuiCard ref={ref} {...props}>
      <CardHeader title={title} subheader={subheader} titleLevel={titleLevel} action={headerAction} />
      {children && <CardBody>{children}</CardBody>}
      {actions && <CardActions sx={{ justifyContent: 'flex-end' }}>{actions}</CardActions>}
    </MuiCard>
  ),
)

Card.displayName = 'Card'
