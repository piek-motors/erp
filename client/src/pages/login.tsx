/** @jsxImportSource @emotion/react */
import { Box, Button, Stack, Typography } from '@mui/joy'
import axios from 'axios'
import { useAppContext } from 'hooks'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AuthService } from 'services/auth.service'
import { ServerErrorResponse } from 'types/global'
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
      <Stack gap={1} my={5}>
        <Typography level="h4" color="primary">
          Piek Factory
        </Typography>
        <MyInput
          placeholder="Email"
          onChange={e => setEmail(e.target.value.trim())}
        />
        <MyInput
          placeholder="Password"
          type="password"
          onChange={e => setPassword(e.target.value.trim())}
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
