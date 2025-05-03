/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Button } from '@mui/joy'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppContext } from 'src/hooks'
import { AuthService } from 'src/services/auth.service'
import { ServerErrorResponse } from 'src/types/global'
import { MyInput } from '../../shortcuts'

const LoginForm = () => {
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

  const loginCardStyles = css`
    display: flex;
    flex-direction: column;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    min-width: 300px;
    color: var(--highContrast);
    background: var(--L1);
    padding: 50px 20px;
    border-radius: var(--br);

    .button {
      margin-left: auto;
      margin-top: 1rem;
      color: var(--accent) !important;
    }

    .error {
      color: red;
      padding: 10px;
    }
  `

  return (
    <div css={loginCardStyles}>
      <h2>Piek ERP</h2>
      <MyInput label="Email" onChange={e => setEmail(e.target.value.trim())} />
      <MyInput
        label="Password"
        type="password"
        onChange={e => setPassword(e.target.value.trim())}
      />
      {error && <div className="error">{error}</div>}
      <Button className="button" variant="outlined" onClick={handleSubmit}>
        Войти
      </Button>
    </div>
  )
}

export default LoginForm
