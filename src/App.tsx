import Box from '@mui/material/Box'
import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { EventsListContainer, OrderLimitBannerContainer, SettingsDialog } from './components/organisms'

const App = () => (
  <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 5 } }}>
    <Stack spacing={5}>
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems={{ sm: 'center' }}>
        <Box sx={{ flex: 1 }}>
          <OrderLimitBannerContainer />
        </Box>
        <SettingsDialog />
      </Stack>
      <EventsListContainer />
    </Stack>
  </Container>
)

export default App
