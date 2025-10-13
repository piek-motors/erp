import { UilPalette } from '@iconscout/react-unicons'
import { Box, Button, Menu } from '@mui/joy'
import { Row, UseIcon } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { Color } from 'models'
import { crud } from './api'
import { Detail } from './group.store'

const map = {
  [Color.Red]: 'red',
  [Color.Orange]: 'orange',
  [Color.Green]: 'green',
  [Color.Blue]: '#0049ff',
  [Color.Indigo]: 'indigo',
  [Color.Violet]: 'violet',
  [Color.Black]: 'black',
  [Color.Grey]: 'grey'
}

export const ColorSegmentation = observer((props: { detail: Detail }) => (
  <Button
    variant="plain"
    sx={{
      p: 0.1,
      m: 0.1,
      width: '-webkit-fill-available',
      minWidth: 20,
      justifyContent: 'start'
    }}
    size="sm"
    color="neutral"
    onClick={e => {
      crud.store.colorSegmentation.init(
        e.currentTarget,
        props.detail,
        crud.store.targetGroup?.group.id!
      )
    }}
  >
    <Row
      gap={0.1}
      sx={{
        height: '-webkit-fill-available',
        alignItems: 'center',
        cursor: 'pointer'
      }}
    >
      {props.detail.colors && props.detail.colors.length > 0 ? (
        props.detail.colors.map(color => (
          <Box
            key={color}
            sx={{
              backgroundColor: map[color],
              height: 15,
              width: 15,
              borderRadius: 10
            }}
          />
        ))
      ) : (
        <Box sx={{ opacity: 0.4 }}>
          <UseIcon icon={UilPalette} small />
        </Box>
      )}
    </Row>
  </Button>
))

export const ColorSegmentationMenu = observer(() => (
  <Box sx={{ width: 100 }}>
    <Menu
      onMouseLeave={() => {
        crud.store.colorSegmentation
          .save()
          .then(() => crud.store.colorSegmentation.clear())
      }}
      variant="outlined"
      open={crud.store.colorSegmentation.detail !== null}
      anchorEl={crud.store.colorSegmentation.anchorEl}
      sx={{ p: 1, m: 0 }}
      placement="bottom-start"
      onClose={() => {
        console.log('onClose')
      }}
    >
      <Row gap={0.2}>
        {Object.entries(map).map(([color, value]) => {
          const selected =
            crud.store.colorSegmentation.detail?.colors?.includes(
              +color as unknown as Color
            )
          return (
            <Box
              onClick={e => {
                e.stopPropagation()
                crud.store.colorSegmentation.addOrDeleteColor(
                  +color as unknown as Color
                )
              }}
              sx={{
                cursor: 'pointer',
                p: 0.2,
                border: selected
                  ? '2px solid #065dff'
                  : '2px solid transparent',
                transition: 'border-bottom 0.2s ease-in-out',
                borderRadius: 14
              }}
            >
              <Box
                sx={{
                  backgroundColor: map[color],
                  height: 20,
                  width: 20,
                  borderRadius: 10
                }}
              />
            </Box>
          )
        })}
      </Row>
    </Menu>
  </Box>
))
