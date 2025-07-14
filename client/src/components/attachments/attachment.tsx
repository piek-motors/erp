import {
  UilCheck,
  UilEllipsisV,
  UilFile,
  UilFileAlt,
  UilImage,
  UilPen
} from '@iconscout/react-unicons'
import { Button, Dropdown, Menu, MenuButton, MenuItem, Stack } from '@mui/joy'
import { Attachment } from 'domain-model'
import { DeleteResourceButton, Inp, P, Row, UseIcon, useState } from 'lib/index'

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
        <FileLink attachment={props.attachment} />
      )}

      {editMode === false && (
        <Dropdown>
          <MenuButton variant="plain" size="sm">
            <UseIcon icon={UilEllipsisV} />
          </MenuButton>
          <Menu size="sm" sx={{ gap: 1, p: 0.5 }}>
            <MenuItem
              onClick={() => {
                setEditMode(true)
              }}
            >
              <UseIcon icon={UilPen} />
            </MenuItem>

            {props.handleDelete && (
              <>
                <DeleteResourceButton
                  onClick={() => props.handleDelete!(props.attachment)}
                />
              </>
            )}
          </Menu>
        </Dropdown>
      )}
    </Row>
  )
}

function getformatAssociatedIcon(filename: string) {
  const fileExtension = filename.split('.')[filename.split('.').length - 1]
  if (['png', 'jpg', 'jpeg'].includes(fileExtension)) {
    return <UseIcon icon={UilImage} />
  } else if (['pdf', 'doc', 'docx'].includes(fileExtension)) {
    return <UseIcon icon={UilFileAlt} />
  } else {
    return <UseIcon icon={UilFile} />
  }
}

function FileLink(props: { attachment: Attachment }) {
  return (
    <a
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
      <Button
        variant="plain"
        sx={{ fontSize: '1rem', textAlign: 'left', fontWeight: 'normal' }}
        color="primary"
        size="sm"
        startDecorator={getformatAssociatedIcon(props.attachment.name)}
      >
        <P>{props.attachment.name}</P>
      </Button>
    </a>
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
    <Row
      display={'flex'}
      justifyContent={'space-between'}
      onKeyDown={handleKeyDown}
    >
      <Inp
        fullWidth
        value={name}
        onChange={e => setName(e)}
        variant="plain"
        sx={{ maxWidth: '100%', minWidth: '100%' }}
      />
      <Button variant="soft" size="sm" onClick={() => props.onSave(name)}>
        <UseIcon icon={UilCheck} />
      </Button>
    </Row>
  )
}
