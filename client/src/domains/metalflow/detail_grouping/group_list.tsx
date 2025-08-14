import { UilBars } from '@iconscout/react-unicons'
import { Button, Stack } from '@mui/joy'
import { InModal } from 'components/modal'
import {
  DesktopOnly,
  MobileOnly,
  observer,
  P,
  UseIcon,
  useState
} from 'lib/index'
import { open, routeMap } from 'lib/routes'
import { Link } from 'react-router-dom'
import { crud } from './api'
import { CreateGroupModal } from './group_name.modal'

const SharedGroupList = observer(
  (props: { setMobileOnlyOpen?: (open: boolean) => void }) => {
    if (crud.store.groups.length === 0) {
      return (
        <P level="body-sm" color="neutral">
          Нет созданных групп
        </P>
      )
    }
    return (
      <Stack py={1} gap={0.5}>
        {crud.store.groups.map(group => {
          const isSelected = crud.store.targetGroup?.group.id === group.id
          return (
            <Link
              onClick={e => {
                props.setMobileOnlyOpen?.(false)
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
  }
)

export const DesktopGroupList = observer(() => {
  return (
    <DesktopOnly>
      <SharedGroupList />
    </DesktopOnly>
  )
})

export const MobileGroupList = observer(() => {
  const [mobileOnlyOpen, setMobileOnlyOpen] = useState(false)
  return (
    <MobileOnly>
      <InModal
        openButton={
          <Button
            variant="solid"
            color="primary"
            startDecorator={<UseIcon icon={UilBars} invert />}
          >
            Группы
          </Button>
        }
        open={mobileOnlyOpen}
        setOpen={v => {
          setMobileOnlyOpen(v)
        }}
      >
        <SharedGroupList setMobileOnlyOpen={setMobileOnlyOpen} />
      </InModal>
    </MobileOnly>
  )
})
