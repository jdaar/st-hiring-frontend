import { forwardRef } from 'react'
import LinearProgress, { LinearProgressProps } from '@mui/material/LinearProgress'

export type ProgressBarProps = LinearProgressProps

// the one loading indicator of the app, indeterminate unless a value is given
export const ProgressBar = forwardRef<HTMLSpanElement, ProgressBarProps>((props, ref) => (
  <LinearProgress ref={ref} {...props} />
))

ProgressBar.displayName = 'ProgressBar'
