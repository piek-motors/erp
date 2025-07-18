import { Button, Stack } from '@mui/joy'
import { InModal } from 'components/modal'
import { DesktopOnly, MobileOnly, observer, P, useState } from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { Link } from 'react-router-dom'
import { CreateGroupModal } from './group_name.modal'
import { store } from './store'

export const DetailGroupList = observer(() => {
  const [mobileOnlyOpen, setMobileOnlyOpen] = useState(false)
  if (store.groups.length === 0) {
    return (
      <P level="body-sm" color="neutral">
        Нет созданных групп
      </P>
    )
  }

  const list = (
    <Stack py={1} gap={0.5}>
      {store.groups.map(group => {
        const isSelected = store.targetGroup?.group.id === group.id
        return (
          <Link
            onClick={e => {
              if (mobileOnlyOpen) {
                setMobileOnlyOpen(false)
              }
            }}
            key={group.id}
            to={open(routeMap.metalflow.detailGroup, group.id)}
            style={{ textDecoration: 'none' }}
          >
            <Button
              size="sm"
              variant={isSelected ? 'soft' : 'plain'}
              color={isSelected ? 'primary' : 'neutral'}
            >
              {group.name}
            </Button>
          </Link>
        )
      })}
      <CreateGroupModal />
    </Stack>
  )

  return (
    <Stack gap={0.5}>
      <MobileOnly>
        <InModal
          openButton={
            <Button variant="soft" color="primary" sx={{ mt: 1 }}>
              Список групп
            </Button>
          }
          open={mobileOnlyOpen}
          setOpen={v => {
            setMobileOnlyOpen(v)
          }}
        >
          {list}
        </InModal>
      </MobileOnly>

      <DesktopOnly>{list}</DesktopOnly>
    </Stack>
  )
})
