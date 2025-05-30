import { Box, Button, ToggleButtonGroup } from '@mui/joy'
import { UiMaterialShape } from 'domain-model'
import { observer } from 'mobx-react-lite'
import { materialListStore } from '../store'

export const MaterialShapeFilter = observer(() => {
  const shapes = Object.entries(UiMaterialShape)
  const value = materialListStore.filterShape?.toString()
  return (
    <Box m={1}>
      <ToggleButtonGroup
        size="sm"
        variant="outlined"
        color="warning"
        value={value}
        onChange={(_, value) => {
          if (value == null) {
            materialListStore.setFilterShape()
          } else {
            materialListStore.setFilterShape(Number(value))
          }
        }}
      >
        {shapes.map(([index, name]) => (
          <Button
            key={index}
            value={index}
            color={value === index ? 'primary' : 'neutral'}
          >
            {name}
          </Button>
        ))}
      </ToggleButtonGroup>
    </Box>
  )
})
