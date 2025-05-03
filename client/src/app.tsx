import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { ReactNotifications } from 'react-notifications-component'
import { Sidebar } from 'src/components/sidebar'
import { NetworkStatusMessage } from './components/network-status-hint'
import { Context } from './index'
import { AppRouter } from './lib/routers/Router'

function App() {
  const { store } = useContext(Context)

  return (
    <div className="App">
      <NetworkStatusMessage />
      <ReactNotifications />
      {store.inMemoryToken && <Sidebar />}
      <div className="base-container">
        <AppRouter />
      </div>
    </div>
  )
}

export default observer(App)
