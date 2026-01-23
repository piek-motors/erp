/** @jsxImportSource @emotion/react */
import { UilEye, UilEyeSlash } from '@iconscout/react-unicons'
import { Box, Button, IconButton, Input, Stack } from '@mui/joy'
import axios from 'axios'
import { CenteredContainer } from 'components/utilities/centered-container'
import { InputLabled, observer, P, UseIcon } from 'lib/index'
import { AuthService } from 'lib/services/auth.service'
import { authStore } from 'lib/store/auth.store'
import type { ServerErrorResponse } from 'lib/types/global'
import { useState } from 'react'
import { useNavigate } from 'react-router'

export const LoginForm = observer(() => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [showPassword, setShowPassword] = useState(false)
	const [error, setError] = useState('')
	const navigate = useNavigate()

	const handleSubmit = async () => {
		try {
			setError('')
			const res = await AuthService.login(email, password)
			authStore.setToken(res.data.accessToken)
			authStore.setUser(res.data.user)
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
			<Stack gap={1} py={1}>
				<P level="h4" color="neutral" fontWeight="800">
					Piek Factory
				</P>
				<InputLabled
					value={email}
					placeholder="Email"
					onChange={v => setEmail(v)}
				/>
				<Input
					sx={{ maxWidth: '300px' }}
					value={password}
					placeholder="Password"
					type={showPassword ? 'text' : 'password'}
					onChange={e => setPassword(e.target.value)}
					endDecorator={
						<IconButton
							size="sm"
							variant="plain"
							color="neutral"
							onClick={() => setShowPassword(!showPassword)}
						>
							<UseIcon icon={showPassword ? UilEyeSlash : UilEye} />
						</IconButton>
					}
				/>
				<Box>
					{error && (
						<P color="danger" pb={1}>
							{error}
						</P>
					)}
					<Button className="button" variant="solid" onClick={handleSubmit}>
						Войти
					</Button>
				</Box>
			</Stack>
		</CenteredContainer>
	)
})
