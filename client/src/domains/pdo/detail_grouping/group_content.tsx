import { UilFolder } from '@iconscout/react-unicons'
import { Box, Stack } from '@mui/joy'
import type { Column } from 'react-table'
import { ScrollableWindow, Search } from '@/components/inputs'
import { Table } from '@/components/table.impl'
import {
  Link,
  Loading,
  observer,
  P,
  Row,
  UseIcon,
  useEffect,
  useParams,
} from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import { app_cache } from '../cache'
import type { DetailSt } from '../detail/detail.state'
import { DetailName } from '../detail/detail_name'
import { DetailStockDelta } from '../detail/detail_stock_delta'
import { api } from './api'
import type { GroupTreeNode } from './group.store'
import { store } from './group.store'
import {
  ChangeGroupNameModal,
  CreateGroupButton,
  CreateSubgroupModal,
} from './group_name.modal'

const detailColumns: Column<DetailSt>[] = [
  {
    Header: 'Название',
    id: 'name',
    accessor: detail => (
      <DetailName
        slot_props={{
          name: { whiteSpace: 'wrap', width: 'auto', lineHeight: '1.2' },
        }}
        detail={detail}
      />
    ),
  },
  {
    Header: 'Остаток',
    accessor: detail => detail.warehouse.stock || '',
  },
  {
    Header: 'Нормативный запас',
    accessor: detail => detail.safe_stock_leftover || '',
  },
  {
    Header: 'Дефицит',
    accessor: detail => <DetailStockDelta detail={detail} />,
  },
]

interface GroupSectionProps {
  group: GroupTreeNode
}

export const GroupContentSection = observer(() => {
  const { id } = useParams<{ id: string }>()

  useEffect(() => {
    if (id) {
      const groupId = parseInt(id, 10)
      if (!Number.isNaN(groupId)) {
        api.load_details(groupId)
      }
    }
  }, [id])

  if (api.details_loading.loading) return <Loading />
  if (!store.group_content.group)
    return (
      <P level="body-sm" p={2}>
        Выберите группу
      </P>
    )

  return <ScrollableWindow scroll={<GroupContent />} />
})

const GroupContent = observer(() => {
  const { group_content, create_subgroup_modal } = store
  const { group } = group_content
  if (!group)
    return (
      <P level="body-sm" color="neutral">
        Выберите группу
      </P>
    )

  return (
    <Stack sx={{ flex: 1, p: 1 }} gap={1}>
      <Row>
        <ChangeNameModal />
        <CreateGroupButton
          tooltip="Создать подгруппу"
          onClick={() => store.create_subgroup_modal.open(group.id)}
        />
      </Row>
      <Search
        value={group_content.query}
        onChange={e => group_content.set_query(e.target.value)}
      />
      <Box sx={{ flex: 1, py: 1, overflow: 'auto', width: '100%' }}>
        {/* child group links */}
        {app_cache.groups.tree.node(group.id)?.children.map(child => (
          <GroupLink key={child.id} group={child} />
        ))}

        {/* Show details of current group */}
        {group_content.details.length === 0 && (
          <P level="body-sm" color="neutral">
            В группе нет деталей
          </P>
        )}

        <Table
          columns={detailColumns}
          data={group_content.get_filtered_and_sorted()}
          sx={{
            width: '100%',
            '& tbody tr:hover': {
              backgroundColor: 'rgba(0, 0, 0, 0.04)',
            },
          }}
        />
      </Box>
      {create_subgroup_modal.is_open && <CreateSubgroupModal />}
    </Stack>
  )
})

const ChangeNameModal = observer(() => {
  const { group } = store.group_content
  if (!group) return null
  return (
    <ChangeGroupNameModal
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
          {app_cache.groups.tree.full_node_name(group.id)}
        </P>
      }
    />
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
