import { forwardRef } from 'react'
import MuiSwitch, { SwitchProps as MuiSwitchProps } from '@mui/material/Switch'

export type SwitchProps = MuiSwitchProps

export const Switch = forwardRef<HTMLButtonElement, SwitchProps>((props, ref) => <MuiSwitch ref={ref} {...props} />)

Switch.displayName = 'Switch'
