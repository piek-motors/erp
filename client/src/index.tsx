import '@fontsource/inter'
import { CssBaseline, ThemeProvider } from '@mui/joy'
import { DictManagerModal } from 'components/dict_manager'
import { observer } from 'mobx-react-lite'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import { NetworkStatusMessage } from './components/network-status-hint'
import { NotifierOverlay } from './components/notifier'
import { AppRouter } from './lib/routers/Router'
import theme from './theme'

const App = observer(() => {
  return (
    <>
      <NotifierOverlay />
      <DictManagerModal />
      <NetworkStatusMessage />
      <AppRouter />
    </>
  )
})

const container =
  document.getElementById('app') || document.createElement('div')
const root = createRoot(container) // createRoot(container!) if you use TypeScript

root.render(
  <BrowserRouter>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </BrowserRouter>,
)
