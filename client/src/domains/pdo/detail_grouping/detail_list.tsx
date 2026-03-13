import { UilFolder, UilPlus } from '@iconscout/react-unicons'
import { Box, Stack } from '@mui/joy'
import { Search } from '@/components/inputs'
import { IconButtonXxs, Link, observer, P, Row, UseIcon } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import { store } from './api'
import { DetailRow } from './detail_row'
import type { GroupTreeNode } from './group.store'
import { CreateSubgroupModal, UpdateGroupNameModal } from './group_name.modal'

interface GroupSectionProps {
  group: GroupTreeNode
}

export const DetailList = observer(() => {
  const { detail_list, opened_group, create_subgroup_modal } = store

  if (!opened_group)
    return (
      <P level="body-sm" color="neutral">
        Выберите группу
      </P>
    )

  const root_group = store.group_tree.find(g => g.id === opened_group.group.id)

  const handleSubgroupClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    e.stopPropagation()
    create_subgroup_modal.open(opened_group.group.id)
  }

  return (
    <Stack sx={{ flex: 1, p: 1 }} gap={1}>
      <Row>
        <UpdateGroupNameModal
          openButton={
            <P
              fontWeight={600}
              sx={{
                cursor: 'text',
                '&:hover': {
                  textDecoration: 'underline',
                  color: 'primary.500',
                },
              }}
            >
              {store.opened_group &&
                store.group_name(store.opened_group.group.id)}
            </P>
          }
        />
        <IconButtonXxs
          variant="plain"
          color="primary"
          onClick={handleSubgroupClick}
          className="subgroup-button"
          sx={{
            width: 'min-content',
          }}
          title="Создать подгруппу"
          icon={UilPlus}
        />
      </Row>
      <Search
        value={detail_list.query}
        onChange={e => detail_list.set_query(e.target.value)}
      />
      <Box sx={{ flex: 1, py: 1, overflow: 'auto' }}>
        <>
          {/* child group links */}
          {root_group?.children.map(child => (
            <GroupLink key={child.id} group={child} />
          ))}

          {/* Show details of current group */}
          {opened_group.details.length === 0 && (
            <P level="body-sm" color="neutral">
              В группе нет деталей
            </P>
          )}

          {opened_group.details.map(detail => (
            <DetailRow key={detail.id} detail={detail} />
          ))}
        </>
      </Box>
      {create_subgroup_modal.is_open && <CreateSubgroupModal />}
    </Stack>
  )
})

const GroupLink = observer(({ group }: GroupSectionProps) => (
  <Row gap={0.5} sx={{ '&:hover .subgroup-button': { opacity: 1 } }}>
    <Link to={openPage(routeMap.pdo.detailGroup, group.id)}>
      <Row
        gap={0.5}
        sx={{
          cursor: 'pointer',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        <UseIcon icon={UilFolder} small />
        <P>{group.name}</P>
      </Row>
    </Link>
  </Row>
))
