import { UilBars } from '@iconscout/react-unicons'
import { Button, Stack } from '@mui/joy'
import { InModal } from 'components/modal'
import { observer, P, UseIcon, useState } from 'lib/index'
import { openPage, routeMap } from 'lib/routes'
import { Link } from 'react-router'
import { crud } from './api'
import { CreateGroupModal } from './group_name.modal'

export const SharedGroupList = observer(
  (props: { onLinkClick?: (open: boolean) => void }) => {
    if (crud.store.groups.length === 0) {
      return (
        <P level="body-sm" color="neutral">
          Нет созданных групп
        </P>
      )
    }
    return (
      <Stack p={1} gap={0}>
        {crud.store.groups.map(group => {
          const isSelected = crud.store.targetGroup?.group.id === group.id
          return (
            <Link
              onClick={e => {
                props.onLinkClick?.(false)
              }}
              key={group.id}
              to={openPage(routeMap.pdo.detailGroup, group.id)}
              style={{ textDecoration: 'none' }}
            >
              <Button
                size="sm"
                variant={isSelected ? 'solid' : 'plain'}
                color={'neutral'}
              >
                {group.name}
              </Button>
            </Link>
          )
        })}
        <CreateGroupModal />
      </Stack>
    )
  }
)

export const GroupSelectModal = observer(() => {
  const [open, setOpen] = useState(false)
  return (
    <InModal
      openButton={
        <Button
          variant="solid"
          color="neutral"
          size="sm"
          startDecorator={<UseIcon icon={UilBars} invert />}
        >
          Группы
        </Button>
      }
      open={open}
      setOpen={v => setOpen(v)}
    >
      <SharedGroupList onLinkClick={setOpen} />
    </InModal>
  )
})
