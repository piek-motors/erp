import { loadDevMessages, loadErrorMessages } from '@apollo/client/dev'
import { __DEV__ } from '@apollo/client/utilities/globals'
import { observer } from 'mobx-react-lite'
import { NetworkStatusMessage } from './components/network-status-hint'
import { NotifierOverlay } from './components/notifier'
import { AppRouter } from './lib/routers/Router'

if (__DEV__) {
  loadDevMessages()
  loadErrorMessages()
}

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
