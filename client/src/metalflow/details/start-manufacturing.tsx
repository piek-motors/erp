import { Dropdown, Menu, MenuButton, Stack } from '@mui/joy'
import { Inp, observer, SendMutation, useState } from 'lib/index'
import { detailStore } from './detail.store'

export const StartManufacturing = observer(() => {
  const [qty, setQty] = useState(0)
  return (
    <Dropdown>
      <MenuButton variant="soft" size="sm" color="primary">
        Начать производство
      </MenuButton>
      <Menu size="sm">
        <Stack gap={1} p={1}>
          <Inp
            label="Кол-во"
            onChange={qty => setQty(Number(qty))}
            value={qty.toString()}
          />
          <SendMutation
            buttonLabel="Запустить"
            onClick={() => detailStore.startManufacturing(qty)}
          />
        </Stack>
      </Menu>
    </Dropdown>
  )
})
