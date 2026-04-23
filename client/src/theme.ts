import { extendTheme } from '@mui/joy/styles'

const theme = extendTheme({
  components: {
    JoyButton: {
      defaultProps: {
        size: 'sm',
      },
    },
  },
})

export default theme
