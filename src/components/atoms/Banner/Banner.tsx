import { forwardRef, ReactNode } from 'react'
import Alert, { AlertProps } from '@mui/material/Alert'
import AlertTitle from '@mui/material/AlertTitle'

export type BannerProps = Omit<AlertProps, 'title'> & {
  title?: ReactNode
}

// page level notice, informational unless a severity says otherwise
export const Banner = forwardRef<HTMLDivElement, BannerProps>(
  ({ title, severity = 'info', children, ...props }, ref) => (
    <Alert ref={ref} severity={severity} {...props}>
      {title && <AlertTitle>{title}</AlertTitle>}
      {children}
    </Alert>
  ),
)

Banner.displayName = 'Banner'
