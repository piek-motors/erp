import { UilFolder } from '@iconscout/react-unicons'
import { Box, Button, Stack } from '@mui/joy'
import { palette } from '@mui/system'
import type { Column } from 'react-table'
import { ScrollableWindow } from '@/components/inputs'
import { NumberInput } from '@/components/inputs/number_input'
import { Table } from '@/components/table.impl'
import {
  Label,
  Link,
  Loading,
  observer,
  P,
  Row,
  UseIcon,
  useEffect,
  useParams,
  useState,
} from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import { notifier } from '@/lib/store/notifier.store'
import theme from '@/lib/theme'
import { app_cache } from '../cache'
import type { DetailSt } from '../detail/detail.state'
import { DetailName } from '../detail/detail_name'
import { DetailStockDelta } from '../detail/detail_stock_delta'
import { DetailSearch } from '../detail/list/detail_search'
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
    Header: '№',
    accessor: d => <Label xs>{d.id}</Label>,
  },
  {
    Header: 'Название',
    id: 'name',
    accessor: detail => (
      <DetailName
        disable_link_tab_focus
        slot_props={{
          name: { whiteSpace: 'wrap', width: 'auto', lineHeight: '1.2' },
        }}
        detail={detail}
      />
    ),
  },
  {
    Header: 'Требование, шт.',
    accessor: detail => <GroupQtyInput detail={detail} />,
  },
  {
    Header: 'Остаток',
    accessor: detail => detail.warehouse.stock || '',
  },
  {
    Header: 'Норм. запас',
    accessor: detail => detail.safe_stock_leftover || '',
  },
  {
    Header: 'Дефицит',
    accessor: detail => <DetailStockDelta detail={detail} />,
  },
]

const GroupQtyInput = observer(({ detail }: { detail: DetailSt }) => {
  const [focused, setFocused] = useState(false)

  return (
    <NumberInput
      sx={{ fontWeight: 600, width: '60px' }}
      variant={focused ? 'soft' : 'plain'}
      color="danger"
      onFocus={e => {
        setFocused(true)
        e.target.select()
      }}
      onBlur={() => setFocused(false)}
      onChange={value => {
        store.group_content.qty_list.set(detail.id, value ?? null)
      }}
      value={store.group_content.qty_list.get(detail.id)?.qty ?? null}
    />
  )
})

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
      <DetailSearch
        criteria={group_content.search_criteria}
        onCriteriaChange={c => group_content.set_search_criteria(c)}
        query={group_content.query}
        onQueryChange={v => group_content.set_query(v)}
      />
      <Box sx={{ flex: 1, py: 1, overflow: 'auto', width: '100%' }}>
        {/* child group links */}
        <Stack>
          {app_cache.groups.tree.node(group.id)?.children.map(child => (
            <GroupLink key={child.id} group={child} />
          ))}
        </Stack>

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
      {store.group_content.qty_list.has_something() && (
        <Button
          sx={{ width: 'fit-content', ml: 'auto' }}
          variant="solid"
          color="primary"
          onClick={() => {
            group_content.qty_list.clear()
            notifier.ok('Требование создано')
          }}
        >
          Создать требование
        </Button>
      )}
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
  <Row
    sx={theme => ({
      width: 'fit-content',
      px: 1,
      py: 0.3,
      borderRadius: 3,
      '&:hover': { background: theme.vars.palette.primary[100] },
    })}
  >
    <Link to={openPage(routeMap.pdo.detailGroup, group.id)}>
      <Row
        gap={1}
        sx={{
          cursor: 'pointer',
          '&:hover': { textDecoration: 'underline' },
        }}
      >
        <UseIcon icon={UilFolder} />
        <P level="body-lg" fontWeight={600}>
          {group.name}
        </P>
      </Row>
    </Link>
  </Row>
))
