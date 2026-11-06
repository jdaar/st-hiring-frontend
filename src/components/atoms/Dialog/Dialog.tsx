import { ReactNode, forwardRef, useId } from 'react'
import MuiDialog, { DialogProps as MuiDialogProps } from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogTitle from '@mui/material/DialogTitle'

export type DialogProps = Omit<MuiDialogProps, 'title' | 'onClose'> & {
  title: ReactNode
  onClose: () => void
  // e.g. a close button, aligned to the end
  actions?: ReactNode
}

// modal named by its title; escape and the backdrop call onClose
export const Dialog = forwardRef<HTMLDivElement, DialogProps>(
  ({ title, actions, children, onClose, ...props }, ref) => {
    const titleId = useId()

    return (
      <MuiDialog ref={ref} aria-labelledby={titleId} onClose={onClose} {...props}>
        <DialogTitle id={titleId}>{title}</DialogTitle>
        <DialogContent>{children}</DialogContent>
        {actions && <DialogActions>{actions}</DialogActions>}
      </MuiDialog>
    )
  },
)

Dialog.displayName = 'Dialog'
