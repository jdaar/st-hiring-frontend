import { forwardRef } from 'react'
import OutlinedInput, { OutlinedInputProps } from '@mui/material/OutlinedInput'

export type InputProps = OutlinedInputProps

export const Input = forwardRef<HTMLDivElement, InputProps>((props, ref) => <OutlinedInput ref={ref} {...props} />)

Input.displayName = 'Input'
