/** @jsxImportSource @emotion/react */
import { HoverReveal, WithHiddenLinkButton } from 'components/hidden_button'
import { Box, Button, Row, observer } from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { cache } from 'metalflow/cache/root'
import { Link } from 'react-router-dom'
import { DetailShortInfoPopup } from './detail_short_info.popup'

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
}

export const DetailName = observer((props: Props) => {
  const { detail, withLink, withGroupLink, withParamsButton } = props

  // Main content: detail name + optional group link
  const mainContent = (
    <>
      <Box sx={{ whiteSpace: 'nowrap', width: 'min-content' }}>
        {detail.name}
      </Box>
      {withGroupLink && <GroupLink groupId={detail.group_id} />}
    </>
  )

  // Content with optional hover popup
  const contentWithPopup = withParamsButton ? (
    <HoverReveal hidden={<DetailShortInfoPopup detailId={detail.id} />}>
      {mainContent}
    </HoverReveal>
  ) : (
    <Row>{mainContent}</Row>
  )

  // Final content with optional link button
  if (withLink) {
    const editLink = detail.id
      ? open(routeMap.metalflow.detail.edit, detail.id)
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
  const groupLink = open(routeMap.metalflow.detailGroup, groupId)

  return (
    <Link to={groupLink} style={{ textDecoration: 'none' }}>
      <Button
        variant="plain"
        color="primary"
        size="sm"
        sx={{ p: '.1 0' }}
        onClick={e => e.stopPropagation()}
      >
        <Box color="primary" sx={{ cursor: 'pointer' }}>
          {groupName}
        </Box>
      </Button>
    </Link>
  )
})
