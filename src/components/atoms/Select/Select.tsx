import { forwardRef } from 'react'
import MuiSelect, { SelectProps as MuiSelectProps } from '@mui/material/Select'

export type SelectProps = MuiSelectProps<string>

export const Select = forwardRef<HTMLDivElement, SelectProps>((props, ref) => <MuiSelect ref={ref} {...props} />)

Select.displayName = 'Select'
