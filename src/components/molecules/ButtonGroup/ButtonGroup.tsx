import { forwardRef } from 'react'
import MuiButtonGroup, { ButtonGroupProps as MuiButtonGroupProps } from '@mui/material/ButtonGroup'

export type ButtonGroupProps = MuiButtonGroupProps

// children are Button atoms
export const ButtonGroup = forwardRef<HTMLDivElement, ButtonGroupProps>((props, ref) => (
  <MuiButtonGroup ref={ref} {...props} />
))

ButtonGroup.displayName = 'ButtonGroup'
