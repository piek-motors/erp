/** @jsxImportSource @emotion/react */

import type { SxProps } from '@mui/joy/styles/types'
import { Box, Link, observer, P, Row, Stack } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import { GroupNamesPreview } from '../detail_grouping/group_name_preview'
import { capitalize } from '../shared/basic'
import type { GroupAssigment } from './detail.state'

interface Detail {
  id: number
  name: string
  group_assigment: GroupAssigment
}

interface Props {
  detail: Detail
  with_group_name?: boolean
  disable_link?: boolean
  with_id?: boolean
  two_lines?: boolean
  slot_props?: {
    name?: SxProps
    row?: SxProps
    group?: SxProps
  }
}

export const DetailName = observer(
  ({
    detail,
    with_group_name,
    disable_link,
    with_id,
    two_lines,
    slot_props,
  }: Props) => {
    const name = (
      <P sx={slot_props?.name} lineHeight={1.2}>
        {capitalize(detail.name)}
      </P>
    )

    const id = with_id && (
      <P level="body-xs" fontSize={10} lineHeight={1}>
        №{detail.id}
      </P>
    )

    const groups = with_group_name && (
      <GroupNamesPreview
        group_ids={detail.group_assigment.group_ids}
        sx={slot_props?.group}
      />
    )

    const content = two_lines ? (
      <Stack
        gap={0}
        sx={slot_props?.row}
        alignItems="center"
        justifyContent={'center'}
      >
        {id}
        {name}
        {groups}
      </Stack>
    ) : (
      <Row gap={1} rowGap={0} sx={slot_props?.row} alignItems="baseline">
        {name}
        {groups}
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
