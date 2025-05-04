import { observer } from 'mobx-react-lite'
import { NetworkStatusMessage } from './components/network-status-hint'
import { NotifierOverlay } from './components/notifier'
import { AppRouter } from './lib/routers/Router'

function App() {
  return (
    <>
      <NotifierOverlay />
      <NetworkStatusMessage />
      <AppRouter />
    </>
  )
}

export default observer(App)
