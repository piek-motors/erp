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
  with_id?: boolean
  sx?: {
    name?: SxProps
    row?: SxProps
    group?: SxProps
  }
}

export const DetailName = observer(
  ({ detail, with_group_name, disable_link, with_id, sx }: Props) => {
    const content = (
      <Row gap={1} rowGap={0} sx={sx?.row} alignItems={'baseline'}>
        <P sx={sx?.name} lineHeight={1.2}>
          {capitalize(detail.name)}
        </P>
        {with_group_name && (
          <GroupName groupId={detail.group_id} sx={sx?.group} />
        )}
        {with_id && (
          <P level="body-xs" fontSize={10}>
            №{detail.id}
          </P>
        )}
      </Row>
    )

    if (disable_link) return content

    return (
      <Box width="fit-content">
        <Link to={openPage(routeMap.pdo.detail.edit, detail.id)}>
          {content}
        </Link>
      </Box>
    )
  },
)

const GroupName = observer(
  ({ groupId, sx }: { groupId?: number | null; sx?: SxProps }) => {
    if (!groupId) return null

    const name = app_cache.groups.name_for(groupId)
    if (!name) return null

    return (
      <P color="primary" sx={{ fontSize: '0.8em', fontWeight: 500, ...sx }}>
        {name.toUpperCase()}
      </P>
    )
  },
)
