import { observer } from 'mobx-react-lite'
import { ReactNotifications } from 'react-notifications-component'
import { NetworkStatusMessage } from './components/network-status-hint'
import { NotifierOverlay } from './components/notifier'
import { AppRouter } from './lib/routers/Router'

function App() {
  return (
    <>
      <NotifierOverlay />
      <NetworkStatusMessage />
      <ReactNotifications />
      <AppRouter />
    </>
  )
}

export default observer(App)
