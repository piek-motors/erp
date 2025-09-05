import { ReactElement, useContext, useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { Context } from '../..'

type IRequireAuthProps = {
  children: ReactElement
}

const RequireAuth = (props: IRequireAuthProps) => {
  const { store } = useContext(Context)
  const [isLoaded, setisLoaded] = useState(false)
  const [token, setToken] = useState(store.inMemoryToken)

  async function getToken() {
    store.checkAuth().then(res => {
      setToken(res)
      setisLoaded(true)
    })
  }

  useEffect(() => {
    if (token) setisLoaded(true)
    else getToken()
  }, [])

  if (!isLoaded) return <>Authentication</>

  return token ? props.children : <Navigate to="/login" />
}

export default RequireAuth
