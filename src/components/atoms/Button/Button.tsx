import { forwardRef } from 'react'
import MuiButton, { ButtonProps as MuiButtonProps } from '@mui/material/Button'
import { ProgressBar } from '../ProgressBar'

export type ButtonProps = MuiButtonProps & {
  // disables the button and runs a progress bar along its bottom edge
  loading?: boolean
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ loading = false, disabled, children, ...props }, ref) => (
  <MuiButton ref={ref} disabled={loading || disabled} aria-busy={loading || undefined} {...props}>
    {children}
    {loading && (
      <ProgressBar
        aria-label="Loading"
        color="inherit"
        sx={{ position: 'absolute', insetInline: 0, bottom: 0, borderRadius: 'inherit' }}
      />
    )}
  </MuiButton>
))

Button.displayName = 'Button'
