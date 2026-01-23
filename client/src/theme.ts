import { extendTheme } from '@mui/joy/styles'

const theme = extendTheme({
	colorSchemes: {
		light: {
			palette: {
				background: {
					body: '#ededed',
					surface: '#f6f2f2', // White surface
				},
			},
		},
		dark: {
			palette: {
				background: {
					body: '#121212', // Dark background
					surface: '#1e1e1e', // Dark surface
				},
			},
		},
	},
	components: {
		JoyButton: {
			defaultProps: {
				size: 'sm',
			},
		},
	},
})

export default theme
