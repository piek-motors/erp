/** @jsxImportSource @emotion/react */

import { Tooltip } from '@mui/joy'
import type { SxProps } from '@mui/joy/styles/types'
import { app_cache } from '@/domains/pdo/cache'
import { Box, Link, observer, P, Row } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import { capitalize } from '../shared/basic'

interface Detail {
  id: number
  name: string
  group_ids?: number[]
}

interface Props {
  detail: Detail
  with_group_name?: boolean
  disable_link?: boolean
  with_id?: boolean
  slot_props?: {
    name?: SxProps
    row?: SxProps
    group?: SxProps
  }
}

export const DetailName = observer(
  ({ detail, with_group_name, disable_link, with_id, slot_props }: Props) => {
    const content = (
      <Row gap={1} rowGap={0} sx={slot_props?.row} alignItems={'baseline'}>
        <P sx={slot_props?.name} lineHeight={1.2}>
          {capitalize(detail.name)}
        </P>
        {with_group_name && (
          <GroupName group_ids={detail.group_ids} sx={slot_props?.group} />
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
  ({
    group_id,
    group_ids,
    sx,
  }: {
    group_id?: number | null
    group_ids?: number[]
    sx?: SxProps
  }) => {
    const ids = group_ids ?? (group_id ? [group_id] : [])
    if (!ids.length) return null

    const paths = ids
      .map(id => app_cache.groups.full_path_for(id))
      .filter((path): path is string => !!path)
    if (!paths.length) return null

    const display_paths = paths.length > 2 ? paths.slice(0, 2) : paths
    const has_more = paths.length > 2
    const display_text = has_more
      ? `${display_paths.join(', ')}...`
      : display_paths.join(', ')

    const groups_component = (
      <P color="primary" sx={{ fontSize: '0.8em', fontWeight: 500, ...sx }}>
        {display_text}
      </P>
    )

    if (has_more) {
      return (
        <Tooltip
          size="sm"
          title={
            <Row>
              {paths.map(path => (
                <div key={path}>{path}</div>
              ))}
            </Row>
          }
        >
          {groups_component}
        </Tooltip>
      )
    }

    return groups_component
  },
)
