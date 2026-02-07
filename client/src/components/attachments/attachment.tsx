/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { UilEllipsisV, UilPen } from '@iconscout/react-unicons'
import { Dropdown, IconButton, Menu, MenuButton, Stack } from '@mui/joy'
import { WebOnly } from '@/components/utilities/conditional-display'
import {
  DeleteResourceButton,
  InputLabled,
  P,
  Row,
  UseIcon,
  useState,
} from '@/lib/index'
import type { Attachment } from './store'

export const AttachmentComponent = (props: {
  attachment: Attachment
  handleDelete?: (attachment: Attachment) => void
  handleRename?: (attachment: Attachment, name: string) => void
  editable?: boolean
}) => {
  const [editMode, setEditMode] = useState(false)
  const editable = props.editable ?? true
  return (
    <Row display={'flex'}>
      {editMode ? (
        <Stack
          flexGrow={1}
          onKeyDown={e => {
            if (e.key === 'Escape') {
              setEditMode(false)
              e.stopPropagation()
            }
          }}
        >
          <FileNameInput
            name={props.attachment.name}
            onSave={name => {
              props.handleRename?.(props.attachment, name)
              setEditMode(false)
            }}
          />
        </Stack>
      ) : (
        <P>
          <a
            css={css`
              display: flex;
              flex-direction: column;
              text-decoration: none;
              font-weight: normal;
              color: inherit;
              &:hover {
                text-decoration: underline;
              }
            `}
            href={`${import.meta.env.VITE_API_URL}/s3/${props.attachment.key}`}
            target="_blank"
            rel="noreferrer"
          >
            {props.attachment.name}
          </a>
        </P>
      )}

      <WebOnly>
        {editable && editMode === false && (
          <Dropdown>
            <MenuButton variant="plain" size="sm">
              <UseIcon icon={UilEllipsisV} small />
            </MenuButton>
            <Menu size="sm" sx={{ gap: 1, p: 0.5 }}>
              <Row>
                <IconButton
                  size="sm"
                  onClick={() => {
                    setEditMode(true)
                  }}
                >
                  <UseIcon icon={UilPen} />
                </IconButton>

                {props.handleDelete && (
                  <>
                    <DeleteResourceButton
                      onClick={() => props.handleDelete!(props.attachment)}
                    />
                  </>
                )}
              </Row>
            </Menu>
          </Dropdown>
        )}
      </WebOnly>
    </Row>
  )
}

function FileNameInput(props: {
  name: string
  onSave: (name: string) => void
}) {
  const [name, setName] = useState(props.name)

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.stopPropagation()
      props.onSave(name)
    }
  }

  return (
    <Row onKeyDown={handleKeyDown}>
      <InputLabled
        fullWidth
        autoFocus
        value={name}
        onChange={e => setName(e)}
        variant="soft"
        sx={{ maxWidth: '100%', minWidth: '100%' }}
      />
    </Row>
  )
}
