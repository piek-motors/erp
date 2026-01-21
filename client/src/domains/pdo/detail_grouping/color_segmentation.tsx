import { UilPalette } from '@iconscout/react-unicons'
import { Box, Button, Menu } from '@mui/joy'
import { Row, UseIcon } from 'lib/index'
import { observer } from 'mobx-react-lite'
import { Color } from 'models'
import { api } from './api'
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
      minHeight: 20,
      justifyContent: 'center',
      alignItems: 'center',
      alignContent: 'center'
    }}
    size="sm"
    color="neutral"
    onClick={e => {
      api.store.colorSegmentation.init(
        e.currentTarget,
        props.detail,
        api.store.openedGroup?.group.id!
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
        api.store.colorSegmentation
          .save()
          .then(() => api.store.colorSegmentation.clear())
      }}
      variant="outlined"
      open={api.store.colorSegmentation.detail !== null}
      anchorEl={api.store.colorSegmentation.anchorEl}
      sx={{ p: 1, m: 0 }}
      placement="bottom-start"
      onClose={() => {
        console.log('onClose')
      }}
    >
      <Row gap={0.2}>
        {Object.entries(map).map(([color, value]) => {
          const selected = api.store.colorSegmentation.detail?.colors?.includes(
            +color as unknown as Color
          )
          return (
            <Box
              onClick={e => {
                e.stopPropagation()
                api.store.colorSegmentation.addOrDeleteColor(
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
