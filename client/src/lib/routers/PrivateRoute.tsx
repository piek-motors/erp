import { authStore } from '@/lib/store/auth.store'
import { observer } from 'mobx-react-lite'
import { type ReactElement, useEffect, useState } from 'react'
import { Navigate } from 'react-router'
import { Loading } from '..'

type IRequireAuthProps = {
  children: ReactElement
}

const RequireAuth = observer((props: IRequireAuthProps) => {
  const [isLoaded, setisLoaded] = useState(false)
  const [token, setToken] = useState(authStore.token)

  async function getToken() {
    authStore.checkAuth().then(res => {
      setToken(res)
      setisLoaded(true)
    })
  }

  useEffect(() => {
    if (token) setisLoaded(true)
    else getToken()
  }, [])

  if (!isLoaded) return <Loading />

  return token ? props.children : <Navigate to="/login" />
})

export default RequireAuth
