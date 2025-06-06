/** @jsxImportSource @emotion/react */
import { Box, Button, Stack, Typography } from '@mui/joy'
import axios from 'axios'
import { useAppContext } from 'hooks'
import { AuthService } from 'lib/services/auth.service'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ServerErrorResponse } from 'types/global'
import { CenteredContainer } from '../components/centered-container'
import { Inp } from '../lib/shortcuts'

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
      <Stack gap={1} my={5}>
        <Typography level="h4" color="primary">
          Piek Factory
        </Typography>
        <Inp value={email} placeholder="Email" onChange={v => setEmail(v)} />
        <Inp
          value={password}
          placeholder="Password"
          type="password"
          onChange={v => setPassword(v)}
        />
        <Box>
          {error && (
            <Typography color="danger" pb={1}>
              {error}
            </Typography>
          )}
          <Button className="button" variant="outlined" onClick={handleSubmit}>
            Войти
          </Button>
        </Box>
      </Stack>
    </CenteredContainer>
  )
}
