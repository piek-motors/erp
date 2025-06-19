import { UilFile, UilFileAlt, UilImage } from '@iconscout/react-unicons'
import { Box, Button } from '@mui/joy'
import { Attachment } from 'domain-model'
import { DeleteResourceButton, P, Row, UseIcon } from 'lib/shortcuts'

export const AttachmentComponent = (props: {
  attachment: Attachment
  handleDelete?: (attachment: Attachment) => void
}) => {
  return (
    <Row justifyContent={'space-between'}>
      <Box>
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
      </Box>

      {props.handleDelete && (
        <DeleteResourceButton
          onClick={() => props.handleDelete!(props.attachment)}
        />
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
