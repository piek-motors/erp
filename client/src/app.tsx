import { observer } from 'mobx-react-lite'
import { ReactNotifications } from 'react-notifications-component'
import { NetworkStatusMessage } from './components/network-status-hint'
import { AppRouter } from './lib/routers/Router'

function App() {
  return (
    <>
      <NetworkStatusMessage />
      <ReactNotifications />
      <AppRouter />
    </>
  )
}

export default observer(App)
