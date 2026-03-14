import { Tooltip } from '@mui/joy'
import type { SxProps } from '@mui/joy/styles/types'
import { observer } from 'mobx-react-lite'
import { P } from '@/lib'
import { app_cache } from '../cache'

export const GroupVisualSeparator = ' | '

function prepare_group_names(group_ids?: number[]) {
  if (!group_ids?.length) return null

  const tree = app_cache.groups.tree

  const visible: string[] = []
  const all: string[] = []

  for (const id of group_ids) {
    const path = tree.full_node_name(id)
    if (!path) continue

    all.push(path)
    if (visible.length < 2) visible.push(path)
  }

  if (!all.length) return null

  return {
    all,
    text: visible.join(GroupVisualSeparator) + (all.length > 2 ? '...' : ''),
    has_more: all.length > 2,
  }
}

export const GroupNamesPreview = observer(
  ({ group_ids, sx }: { group_ids?: number[]; sx?: SxProps }) => {
    const data = prepare_group_names(group_ids)
    if (!data) return null

    const content = (
      <P color="primary" sx={{ fontSize: '0.8em', fontWeight: 500, ...sx }}>
        {data.text}
      </P>
    )

    if (!data.has_more) return content

    return (
      <Tooltip size="sm" title={<div>{data.all.join(' | ')}</div>}>
        {content}
      </Tooltip>
    )
  },
)
