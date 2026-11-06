import { forwardRef } from 'react'
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button'
import CircularProgress from '@mui/material/CircularProgress'

export type ButtonProps = MuiButtonProps & {
  // disables the button and replaces its start icon with a spinner
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ loading = false, disabled, startIcon, ...props }, ref) => (
  <MuiButton
    ref={ref}
    disabled={loading || disabled}
    aria-busy={loading || undefined}
    startIcon={loading ? <CircularProgress color="inherit" size="1em" /> : startIcon}
    {...props}
  />
))

Button.displayName = 'Button'
