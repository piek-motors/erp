import { Button, ToggleButtonGroup, observer } from 'lib/index'
import { UiMaterialShape } from 'models'
import { materialListStore } from './store'

export const MaterialShapeFilter = observer(() => {
  const shapes = Object.entries(UiMaterialShape)
  const value = materialListStore.filterShape?.toString()
  return (
    <ToggleButtonGroup
      size="sm"
      variant="soft"
      color="primary"
      value={value}
      sx={{ overflow: 'hidden' }}
      onChange={(_, value) => {
        if (value == null) {
          materialListStore.setFilterShape()
        } else {
          materialListStore.setFilterShape(Number(value))
        }
      }}
    >
      {shapes.map(([index, name]) => (
        <Button key={index} value={index}>
          {name}
        </Button>
      ))}
    </ToggleButtonGroup>
  )
})
