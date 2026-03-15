/** Tree node components for hierarchical group display. */
import { UilFolder, UilFolderOpen, UilListUl } from '@iconscout/react-unicons'
import { Box, Button, Sheet } from '@mui/joy'
import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { observer, Row, UseIcon, useEffect } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import type { GroupAssigment } from '../detail/detail.state'
import { store } from './group.store'
import type { Node } from './tree/node_vm'

export interface TreeNodeProps {
  node: Node
  depth: number
  onClick?: (id: number) => void
  strategy: 'link' | 'btn'
  group_assigment?: GroupAssigment
}

export const TreeNode = observer(
  ({ node, depth, onClick, group_assigment, strategy }: TreeNodeProps) => {
    const selected_ids = group_assigment?.group_ids ?? []

    useEffect(() => {
      const active_node = store.group_content.group?.id
      if (active_node) {
        node.expand_up_to_node(active_node)
      }
    }, [])

    const SelectionControl = group_assigment ? (
      <input
        type={'checkbox'}
        checked={selected_ids.includes(node.id)}
        onChange={() => {
          group_assigment?.on_selection_change?.(node.id)
        }}
        onClick={e => e.stopPropagation()}
      />
    ) : null

    const group_props: GroupLinkProps = {
      node,
      is_active: store.group_content.group?.id === node.id,
      startDecorator: <ExpandButton node={node} />,
      onClick: (node: Node) => {
        onClick?.(node.id)
        node.toggle_expanded()
      },
    }

    return (
      <>
        <Row
          noWrap
          gap={0.5}
          pl={0.5}
          justifyContent={'center'}
          sx={{
            width: 'min-content',
          }}
        >
          {strategy === 'btn' ? (
            <>
              {SelectionControl}
              <GroupBtn {...group_props} />
            </>
          ) : (
            <GroupLink {...group_props} />
          )}
        </Row>

        {node.is_expanded(group_assigment?.group_ids) && (
          <Sheet sx={{ ml: 2, position: 'relative' }}>
            <LevelIndicator />
            {node.children.map(child => (
              <TreeNode
                strategy={strategy}
                node={child}
                depth={depth + 1}
                onClick={onClick}
                group_assigment={group_assigment}
              />
            ))}
          </Sheet>
        )}
      </>
    )
  },
)

/** Expand/collapse button or empty spacer. */
const ExpandButton = observer(({ node }: { node: Node }) => {
  const size = 20

  let icon = UilListUl
  let opacity = 0.1
  if (node.has_childrens()) {
    opacity = 1
    icon = node.is_expanded() ? UilFolderOpen : UilFolder
  }

  return (
    <UseIcon
      small
      icon={icon}
      settings={{ opacity, width: size, fill: 'black' }}
    />
  )
})

interface GroupLinkProps {
  node: Node
  is_active: boolean
  onClick?: (node: Node) => void
  startDecorator?: ReactNode
}

const GroupLink = observer(
  ({ node, is_active, onClick, startDecorator }: GroupLinkProps) => (
    <Link
      onClick={e => onClick?.(node)}
      key={node.id}
      to={openPage(routeMap.pdo.detailGroup, node.id)}
      style={{ textDecoration: 'none' }}
    >
      <GroupBtn
        startDecorator={startDecorator}
        is_active={is_active}
        node={node}
      />
    </Link>
  ),
)

export const GroupBtn = observer(
  ({ node, is_active, startDecorator, onClick }: GroupLinkProps) => (
    <Button
      onClick={e => onClick?.(node)}
      startDecorator={startDecorator}
      variant={is_active ? 'soft' : 'plain'}
      color={is_active ? 'primary' : 'neutral'}
      sx={{
        width: 'max-content',
        justifyContent: 'start',
        fontWeight: 500,
        textAlign: 'left',
        fontSize: '.9rem',
        flex: 1,
        minHeight: 15,
        pl: 0.5,
        pr: 0.5,
        '&:hover': {},
      }}
    >
      {node.name}
    </Button>
  ),
)

const LevelIndicator = () => (
  <Box
    sx={{
      position: 'absolute',
      width: 2,
      borderRadius: 10,
      height: 1,
      backgroundColor: '#9f9fba',
    }}
  />
)
