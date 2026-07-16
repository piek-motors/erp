import { DarkModeRounded, LightModeRounded } from '@mui/icons-material'
import { Switch } from '@mui/joy'
import { useColorScheme } from '@mui/joy/styles'
import { UseIcon } from '@/lib/index'

export const ThemeModeSwitch = () => {
  const { mode, systemMode, setMode } = useColorScheme()
  const effectiveMode = mode === 'system' ? systemMode : mode
  const isDark = effectiveMode === 'dark'

  return (
    <Switch
      checked={isDark}
      color={isDark ? 'primary' : 'neutral'}
      startDecorator={<UseIcon icon={LightModeRounded} small />}
      endDecorator={<UseIcon icon={DarkModeRounded} small />}
      slotProps={{
        input: {
          'aria-label': 'Переключить ночную тему',
        },
      }}
      sx={{ alignSelf: 'center' }}
      onChange={event => setMode(event.target.checked ? 'dark' : 'light')}
    />
  )
}
