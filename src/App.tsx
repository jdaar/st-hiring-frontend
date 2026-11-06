import Container from '@mui/material/Container'
import Stack from '@mui/material/Stack'
import { EventsListContainer, SettingsFormContainer } from './components/organisms'

const App = () => (
  <Container maxWidth="lg" sx={{ py: { xs: 2.5, md: 5 } }}>
    <Stack spacing={5}>
      <EventsListContainer />
      <SettingsFormContainer />
    </Stack>
  </Container>
)

export default App
