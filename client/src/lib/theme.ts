import { extendTheme } from '@mui/joy/styles'

const theme = extendTheme({
  colorSchemes: {
    light: {
      palette: {
        background: {
          body: '#f5f7fa',
        },
      },
    },
    dark: {
      palette: {
        background: {
          body: '#0f172a',
          surface: '#111827',
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
