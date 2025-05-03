/** @jsxImportSource @emotion/react */
import { Button, Sheet, Stack } from '@mui/joy'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from 'src/hooks'
import { AuthService } from 'src/services/auth.service'
import { ServerErrorResponse } from 'src/types/global'
import { CenteredContainer } from '../components/centered-container'
import { MyInput } from '../shortcuts'

export const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const { store } = useAppContext()
  const navigate = useNavigate()

  const handleSubmit = async () => {
    try {
      const res = await AuthService.login(email, password)
      store.setInMemoryToken(res.data.accessToken)
      store.setUser(res.data.user)
      navigate('/')
    } catch (e: any) {
      if (axios.isAxiosError(e)) {
        setError((e.response?.data as ServerErrorResponse).error.message)
      } else {
        setError('There is probably not the network/server error.')
      }
    }
  }

  return (
    <CenteredContainer maxWidth="sm">
      <Sheet sx={{ p: 2 }}>
        <Stack gap={2}>
          <h2>Piek ERP</h2>
          <MyInput
            label="Email"
            onChange={e => setEmail(e.target.value.trim())}
          />
          <MyInput
            label="Password"
            type="password"
            onChange={e => setPassword(e.target.value.trim())}
          />
          {error && <div className="error">{error}</div>}
          <Button className="button" variant="outlined" onClick={handleSubmit}>
            Войти
          </Button>
        </Stack>
      </Sheet>
    </CenteredContainer>
  )
}
