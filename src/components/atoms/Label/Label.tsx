import { forwardRef } from 'react'
import InputLabel, { InputLabelProps } from '@mui/material/InputLabel'

export type LabelProps = InputLabelProps

export const Label = forwardRef<HTMLLabelElement, LabelProps>((props, ref) => <InputLabel ref={ref} {...props} />)

Label.displayName = 'Label'
