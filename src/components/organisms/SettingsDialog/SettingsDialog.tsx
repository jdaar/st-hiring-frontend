import { useState } from 'react'
import { Button, Dialog } from '../../atoms'
import { SettingsFormContainer } from '../SettingsForm'

// button that opens the settings in a modal; the settings load when it opens
export const SettingsDialog = () => {
  const [open, setOpen] = useState(false)
  const close = () => setOpen(false)

  return (
    <>
      <Button variant="outlined" onClick={() => setOpen(true)} sx={{ flexShrink: 0 }}>
        Settings
      </Button>
      <Dialog
        open={open}
        onClose={close}
        title="Settings"
        fullWidth
        maxWidth="md"
        actions={<Button onClick={close}>Close</Button>}
      >
        <SettingsFormContainer />
      </Dialog>
    </>
  )
}
