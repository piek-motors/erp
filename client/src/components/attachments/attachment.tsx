/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { UilEllipsisV, UilPen } from '@iconscout/react-unicons'
import { Dropdown, IconButton, Menu, MenuButton, Stack } from '@mui/joy'
import { WebOnly } from 'components/utilities/conditional-display'
import {
  DeleteResourceButton,
  Inp,
  P,
  Row,
  SaveIconButton,
  UseIcon,
  useState
} from 'lib/index'
import { Attachment } from 'models'

export const AttachmentComponent = (props: {
  attachment: Attachment
  handleDelete?: (attachment: Attachment) => void
  handleRename?: (attachment: Attachment, name: string) => void
}) => {
  const [editMode, setEditMode] = useState(false)
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
              color: inherit;
            `}
            href={`${process.env.REACT_APP_API_URL}/s3/${props.attachment.key}`}
            target="_blank"
            rel="noreferrer"
            style={{
              display: 'flex',
              flexDirection: 'column',
              textDecoration: 'none',
              fontWeight: 'normal'
            }}
          >
            {props.attachment.name}
          </a>
        </P>
      )}

      <WebOnly>
        {editMode === false && (
          <Dropdown>
            <MenuButton variant="plain" size="sm">
              <UseIcon icon={UilEllipsisV} small />
            </MenuButton>
            <Menu size="sm" sx={{ gap: 1, p: 0.5 }}>
              <Row>
                <IconButton
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
    <Row display={'flex'} onKeyDown={handleKeyDown}>
      <Inp
        fullWidth
        value={name}
        onChange={e => setName(e)}
        variant="plain"
        sx={{ maxWidth: '100%', minWidth: '100%' }}
      />
      <SaveIconButton
        onClick={() => props.onSave(name)}
        variant="soft"
        color="success"
      />
    </Row>
  )
}
