import { UilFolder, UilPlus } from '@iconscout/react-unicons'
import { Box, Stack } from '@mui/joy'
import { Search } from '@/components/inputs'
import { IconButtonXxs, Link, observer, P, Row, UseIcon } from '@/lib/index'
import { openPage, routeMap } from '@/lib/routes'
import { app_cache } from '../cache'
import type { DetailSt } from '../detail/detail.state'
import { DetailName } from '../detail/detail_name'
import { store } from './api'
import type { GroupTreeNode } from './group.store'
import { ChangeGroupNameModal, CreateSubgroupModal } from './group_name.modal'

interface GroupSectionProps {
  group: GroupTreeNode
}

export const GroupContent = observer(() => {
  const {
    group_content: detail_list,
    group,
    details,
    create_subgroup_modal,
  } = store

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
        <CreateSubgroupButton />
      </Row>
      <Search
        value={detail_list.query}
        onChange={e => detail_list.set_query(e.target.value)}
      />
      <Box sx={{ flex: 1, py: 1, overflow: 'auto' }}>
        <>
          {/* child group links */}
          {app_cache.groups.get(group.id)?.children.map(child => (
            <GroupLink key={child.id} group={child} />
          ))}

          {/* Show details of current group */}
          {details.length === 0 && (
            <P level="body-sm" color="neutral">
              В группе нет деталей
            </P>
          )}

          {details.map(detail => (
            <DetailRow key={detail.id} detail={detail} />
          ))}
        </>
      </Box>
      {create_subgroup_modal.is_open && <CreateSubgroupModal />}
    </Stack>
  )
})

const CreateSubgroupButton = observer(() => {
  const { group } = store
  if (!group) return null
  return (
    <IconButtonXxs
      variant="plain"
      color="primary"
      onClick={() => store.create_subgroup_modal.open(group.id)}
      className="subgroup-button"
      sx={{
        width: 'min-content',
      }}
      title="Создать подгруппу"
      icon={UilPlus}
    />
  )
})

const ChangeNameModal = observer(() => {
  if (!store.group) return null
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
          {store.group_name(store.group.id)}
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

interface DetailRowProps {
  detail: DetailSt
  onClick?: (detailId: number) => void
}

const DetailRow = ({ detail, onClick: onToggle }: DetailRowProps) => (
  <Row
    sx={{
      alignItems: 'center',
      display: 'flex',
      p: 0.5,
      mb: 0,
      '&:hover .detail-arrow': {
        opacity: 1,
      },
      cursor:
        detail.group_assigment.group_ids.length === 0 ? 'pointer' : 'default',
    }}
    alignItems="center"
    onClick={() => onToggle?.(detail.id)}
  >
    <DetailName
      slot_props={{
        name: { whiteSpace: 'wrap', width: 'auto', lineHeight: '1.2' },
      }}
      detail={detail}
    />
  </Row>
)
