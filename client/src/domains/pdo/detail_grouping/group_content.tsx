import { Box, Divider, Option, Select, Stack } from '@mui/joy'
import type { Column } from 'react-table'
import { ScrollableWindow } from '@/components/inputs'
import { NumberInput } from '@/components/inputs/number_input'
import { Table } from '@/components/table.impl'
import {
  Label,
  Loading,
  observer,
  P,
  PlusIcon,
  Row,
  useEffect,
  useParams,
  useState,
} from '@/lib/index'
import { app_cache } from '../cache'
import type { DetailSt } from '../detail/detail.state'
import { DetailName } from '../detail/detail_name'
import { DetailStockDelta } from '../detail/detail_stock_delta'
import { DetailSearch } from '../detail/list/detail_search'
import {
  DetailRequestFormModal,
  NewDetailRequestButton,
} from '../detail_requests/form'
import { api } from './api'
import { store } from './group.store'
import {
  ChangeGroupNameModal,
  CreateGroupButton,
  CreateSubgroupModal,
} from './group_name.modal'
import { ExpandDirIcon, GroupLink } from './tree_node'

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
      size="sm"
      sx={{ fontWeight: 600, width: '40px', minHeight: 20 }}
      variant={focused ? 'outlined' : 'plain'}
      color="primary"
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
            <GroupLink
              key={child.id}
              title={child.name}
              is_active={false}
              group_id={child.id}
              startDecorator={<ExpandDirIcon />}
            />
          ))}
        </Stack>

        {/* Show details of current group */}
        {group_content.details.length === 0 && (
          <P level="body-sm" color="neutral">
            В группе нет деталей
          </P>
        )}

        <Table
          small
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
      <AddToRequirementAction />
      {create_subgroup_modal.is_open && <CreateSubgroupModal />}
    </Stack>
  )
})

const RequirementActionBar = (props: { children: React.ReactNode }) => (
  <Box
    sx={{
      position: 'sticky',
      bottom: 0,
      zIndex: 2,
      display: 'flex',
      justifyContent: 'flex-end',
      py: 1,
      px: 1,
      borderColor: 'divider',
    }}
  >
    {props.children}
  </Box>
)

const AddToRequirementAction = observer(() => {
  const { add_to_requirement, qty_list } = store.group_content

  useEffect(() => {
    add_to_requirement.load_open_requests()
  }, [add_to_requirement])

  if (!add_to_requirement.requests_loaded) return null
  if (!qty_list.has_something()) return null
  return (
    <RequirementActionBar>
      <Stack gap={0.5}>
        <Label level="body-xs" textAlign={'center'}>
          Добавить в требование
        </Label>
        <Row rowGap={2}>
          <Row>
            <Select
              size="sm"
              variant="soft"
              color="primary"
              value={add_to_requirement.selected_request_id}
              onChange={(_, value) =>
                add_to_requirement.set_selected_request_id(value)
              }
              placeholder="Открытое требование"
              disabled={add_to_requirement.requests.length === 0}
              sx={{ minWidth: 260 }}
            >
              {add_to_requirement.requests.map(request => (
                <Option key={request.id} value={request.id}>
                  №{request.id} {request.order_id} - {request.product_name}
                </Option>
              ))}
            </Select>
            {add_to_requirement.selected_request_id && (
              <PlusIcon
                title="Добавить в требование"
                disabled={add_to_requirement.loading}
                onClick={() => add_to_requirement.add_to_selected_request()}
              />
            )}
          </Row>
          <Divider orientation="vertical" />
          <NewDetailRequestButton
            disabled={add_to_requirement.loading}
            onClick={() => add_to_requirement.set_create_open(true)}
          />
          <DetailRequestFormModal
            open={add_to_requirement.create_open}
            setOpen={open => add_to_requirement.set_create_open(open)}
            initialDetails={add_to_requirement.initial_details}
            initialProductName={add_to_requirement.initial_product_name}
            onSaved={() => add_to_requirement.after_create_saved()}
          />
        </Row>
      </Stack>
    </RequirementActionBar>
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
