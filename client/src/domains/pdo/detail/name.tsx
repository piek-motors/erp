/** @jsxImportSource @emotion/react */
import { SxProps } from '@mui/joy/styles/types'
import { HoverReveal, WithHiddenLinkButton } from 'components/hidden_button'
import { cache } from 'domains/pdo/cache/root'
import { Box, Button, Row, observer } from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { Link } from 'react-router'

interface Detail {
  id: number
  name: string
  group_id: number | null
}

interface Props {
  detail: Detail
  withLink?: boolean
  withGroupLink?: boolean
  withParamsButton?: boolean
  sx?: SxProps
}

const capitalizeFirstLetter = (str: string): string => {
  if (str.length < 2) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const DetailName = observer((props: Props) => {
  const { detail, withLink, withGroupLink, withParamsButton } = props

  // Main content: detail name + optional group link
  const mainContent = (
    <>
      <Box sx={{ width: 'min-content', whiteSpace: 'nowrap', ...props.sx }}>
        {capitalizeFirstLetter(detail.name)}
      </Box>
      {withGroupLink && <GroupLink groupId={detail.group_id} />}
    </>
  )

  // Content with optional hover popup
  const contentWithPopup = withParamsButton ? (
    <HoverReveal hidden={<></>}>{mainContent}</HoverReveal>
  ) : (
    <Row>{mainContent}</Row>
  )

  // Final content with optional link button
  if (withLink) {
    const editLink = detail.id
      ? openPage(routeMap.pdo.detail.edit, detail.id)
      : '#'

    return (
      <WithHiddenLinkButton linkTo={editLink}>
        {contentWithPopup}
      </WithHiddenLinkButton>
    )
  }

  return contentWithPopup
})

// Component for linking to a detail group
const GroupLink = observer(({ groupId }: { groupId: number | null }) => {
  if (!groupId) return null
  const groupName = cache.detailGroups.getGroupName(groupId)
  const groupLink = openPage(routeMap.pdo.detailGroup, groupId)
  return (
    <Link to={groupLink} style={{ textDecoration: 'none' }}>
      <Button
        variant="plain"
        color="primary"
        size="sm"
        sx={{ p: '0 5px' }}
        onClick={e => e.stopPropagation()}
      >
        <Box
          color="primary"
          sx={{ cursor: 'pointer', fontSize: '0.9em', fontWeight: 'normal' }}
        >
          {groupName?.toLowerCase() || ''}
        </Box>
      </Button>
    </Link>
  )
})
