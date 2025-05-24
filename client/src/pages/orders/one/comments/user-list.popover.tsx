import { Menu, MenuItem } from '@mui/joy'
import { TUser } from 'types/global'
import placeCaretAtEnd from 'utils/placeCaretAtEnd'

interface IUserListPopoverProps {
  anchorEl: Element | null
  open: boolean
  handleClose: () => void
  users: TUser[]
  inputRef: React.RefObject<HTMLInputElement>
}

export function UserListPopover({
  anchorEl,
  open,
  handleClose,
  users,
  inputRef
}: IUserListPopoverProps) {
  const handleClick = (user_id: number) => {
    handleClose()
    if (!inputRef.current) return

    const user = users.find(e => e.id === user_id)
    const inputform = document.getElementById('Comments_InputForm')

    if (!user) throw Error('user is null')
    if (!inputform) throw Error('cant get Comments_InputForm link')

    const elem = document.createElement('span')
    inputRef.current.innerText = inputRef.current?.innerText.slice(0, -1)

    elem.innerHTML = '@' + [user.first_name, user.last_name].join(' ') + ', '
    elem.dataset.mentionedUser = user.id.toString()
    elem.contentEditable = 'false'
    inputform?.appendChild(elem)

    placeCaretAtEnd(inputform)

    const space = document.createElement('span')
    inputform?.appendChild(space)
  }

  return (
    <Menu
      autoFocus
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      placement="bottom-start"
    >
      {users &&
        users.map(user => (
          <MenuItem key={user.id} onClick={() => handleClick(user.id)}>
            {user.first_name} {user.last_name}
          </MenuItem>
        ))}
    </Menu>
  )
}
