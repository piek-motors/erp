/** @jsxImportSource @emotion/react */

import type { SxProps } from '@mui/joy/styles/types'
import { app_cache } from '@/domains/pdo/cache'
import { Box, Link, observer, P, Row } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import { capitalize } from '../shared/basic'

interface Detail {
  id: number
  name: string
  group_id?: number | null
}

interface Props {
  detail: Detail
  with_group_name?: boolean
  disable_link?: boolean
  sx?: SxProps
}

export const DetailName = observer(
  ({
    detail,
    with_group_name: withGroupName,
    disable_link: disableLink,
    sx,
  }: Props) => {
    const content = (
      <Row gap={1} rowGap={0} flexWrap="wrap">
        <P sx={sx}>{capitalize(detail.name)}</P>
        {withGroupName && <GroupName groupId={detail.group_id} />}
      </Row>
    )

    if (disableLink) return content

    return (
      <Box width="fit-content">
        <Link to={openPage(routeMap.pdo.detail.edit, detail.id)}>
          {content}
        </Link>
      </Box>
    )
  },
)

const GroupName = observer(({ groupId }: { groupId?: number | null }) => {
  if (!groupId) return null

  const name = app_cache.groups.name_for(groupId)
  if (!name) return null

  return (
    <P
      color="primary"
      sx={{ cursor: 'pointer', fontSize: '0.9em', fontWeight: 500 }}
    >
      {name.toLowerCase()}
    </P>
  )
})
