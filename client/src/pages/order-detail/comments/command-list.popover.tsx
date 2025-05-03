import { UilListUl, UilUser } from '@iconscout/react-unicons'
import { Menu, MenuItem } from '@mui/joy'
import sass from './index.module.sass'

interface IСommandsPopoverProps {
  anchorEl: Element | null
  open: boolean
  handleClose: () => void
  inputRef: React.RefObject<HTMLInputElement>
  setAnchorULP: React.Dispatch<React.SetStateAction<Element | null>>
}

export default function СommandListPopover({
  anchorEl,
  open,
  handleClose,
  setAnchorULP,
  inputRef
}: IСommandsPopoverProps) {
  function insertTodoinDOM() {
    const root = document.getElementById('Comments_InputForm')
    const elem = document.createElement('div')
    elem.classList.add(sass.checklistUnit)
    elem.setAttribute('data-testid', 'checkListUnit')
    root?.appendChild(elem)
  }

  function mentionHandler() {
    handleClose()
    setAnchorULP(inputRef.current)
  }

  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      placement="bottom-start"
      sx={{ p: 1 }}
    >
      <MenuItem
        onClick={() => {
          handleClose()
          insertTodoinDOM()
        }}
      >
        <UilListUl />
        Чеклист
      </MenuItem>
      <MenuItem onClick={mentionHandler}>
        <UilUser />
        Упомянуть
      </MenuItem>
    </Menu>
  )
}
