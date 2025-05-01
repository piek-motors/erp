import {
  createTheme as createMuiTheme,
  ThemeProvider
} from '@mui/material/styles'
import { observer } from 'mobx-react-lite'
import { useContext } from 'react'
import { ReactNotifications } from 'react-notifications-component'
import { Sidebar } from 'src/components/sidebar'
import { NetworkStatusMessage } from './components/network-status-hint'
import { useLocalStorageState } from './hooks'
import { Context } from './index'
import { customizedTheme } from './lib/material-ui/customized-theme'
import { AppRouter } from './lib/routers/Router'
import { SystemPreferTheme } from './utils/systemPreferTheme'

function App() {
  const { store } = useContext(Context)

  const [appTheme, setAppTheme] = useLocalStorageState({
    name: 'theme',
    defaultValue: 'light'
  })

  store.setUItheme(appTheme, setAppTheme)

  const { mode } = SystemPreferTheme(appTheme, setAppTheme)
  const theme = createMuiTheme(customizedTheme(mode))
  return (
    <ThemeProvider theme={theme}>
      <div className="App">
        <NetworkStatusMessage />

        <ReactNotifications />
        {store.inMemoryToken && <Sidebar />}

        <div className="base-container">
          <AppRouter />
        </div>
      </div>
    </ThemeProvider>
  )
}

export default observer(App)
