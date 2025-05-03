import { UilMessage } from '@iconscout/react-unicons'
import { Box, IconButton } from '@mui/joy'
import React, { useState } from 'react'
import { useGetAllUsersQuery } from 'src/types/graphql-shema'
import СommandListPopover from './command-list.popover'
import sass from './index.module.sass'
import { UserListPopover } from './user-list.popover'

interface InputFormProps {
  insertComment: () => void
  inputRef: React.RefObject<HTMLInputElement>
}

export function InputForm({ insertComment, inputRef }: InputFormProps) {
  const { data: users } = useGetAllUsersQuery()

  const [anchorEl, setAnchorEl] = useState<Element | null>(null)
  // User List Popover
  const [anchorULP, setAnchorULP] = useState<Element | null>(null)

  function handleChange(e: React.ChangeEvent<HTMLDivElement>) {
    const innerText = e.target.textContent?.trim()
    if (!innerText) return

    if (innerText.at(-1) === '/') {
      setAnchorEl(e.target)
      e.target.textContent = innerText.slice(0, innerText.length - 1) + ' '
    }
    if (e.target.textContent?.trim() === '@') {
      setAnchorULP(e.target)
    }
  }

  const handleClose = () => setAnchorEl(null)
  const handleCloseUserListPopover = () => setAnchorULP(null)

  return (
    <div className={`${sass.commentInputForm} noprint`}>
      <СommandListPopover
        setAnchorULP={setAnchorULP}
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        handleClose={handleClose}
        inputRef={inputRef}
      />
      <UserListPopover
        anchorEl={anchorULP}
        open={Boolean(anchorULP)}
        handleClose={handleCloseUserListPopover}
        users={users?.erp_Users || []}
        inputRef={inputRef}
      />

      <Box
        contentEditable="true"
        ref={inputRef}
        sx={{ minHeight: 20, padding: '10px 5px' }}
        data-ph="Комментарий или ' / ' для команды"
        suppressContentEditableWarning={true}
        onInput={handleChange}
        data-testid="inputForm"
      ></Box>

      <IconButton onClick={insertComment}>
        <UilMessage />
      </IconButton>
    </div>
  )
}
