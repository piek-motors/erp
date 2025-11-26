/** @jsxImportSource @emotion/react */
import { SxProps } from '@mui/joy/styles/types'
import { WithHiddenLinkButton } from 'components/hidden_button'
import { cache } from 'domains/pdo/cache/root'
import { Box, P, Row, observer } from 'lib/index'
import { openPage, routeMap } from 'lib/routes'

interface Detail {
  id: number
  name: string
  group_id: number | null
}

interface Props {
  detail: Detail
  withLink?: boolean
  withGroupName?: boolean
  sx?: SxProps
}

const capitalizeFirstLetter = (str: string): string => {
  if (str.length < 2) return str
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const DetailName = observer((props: Props) => {
  const { detail, withLink, withGroupName } = props

  // Main content: detail name + optional group link
  const mainContent = (
    <>
      <Box sx={{ width: 'min-content', whiteSpace: 'nowrap', ...props.sx }}>
        {capitalizeFirstLetter(detail.name)}
      </Box>
      {withGroupName && <GroupName groupId={detail.group_id} />}
    </>
  )

  // Final content with optional link button
  if (withLink) {
    const editLink = detail.id
      ? openPage(routeMap.pdo.detail.edit, detail.id)
      : '#'

    return (
      <WithHiddenLinkButton linkTo={editLink}>
        <Row>{mainContent}</Row>
      </WithHiddenLinkButton>
    )
  }

  return <Row>{mainContent}</Row>
})

const GroupName = observer(({ groupId }: { groupId: number | null }) => {
  if (!groupId) return null
  const groupName = cache.detailGroups.getGroupName(groupId)
  return (
    <P
      color="primary"
      sx={{ cursor: 'pointer', fontSize: '0.9em', fontWeight: 'normal' }}
    >
      {groupName?.toLowerCase() || ''}
    </P>
  )
})
