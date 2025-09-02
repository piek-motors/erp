/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import { Container } from '@mui/joy'
import { NavigationBar } from 'components/navigation_bar'
import { Context } from 'index'
import {
  Box,
  Button,
  ExecuteAction,
  P,
  Row,
  Sheet,
  Stack,
  useNavigate,
  useState
} from 'lib/index'
import { openOrderDetailPage } from 'lib/routes'
import { rpc } from 'lib/rpc.client'
import { TNotification } from 'lib/types/global'
import {
  useGetNotificationsSubscription,
  useUpdateNotificationSeenMutation
} from 'lib/types/graphql-shema'
import moment from 'moment'
import { useContext } from 'react'

interface INotificationProps {
  data: TNotification
}

function Mention({ data }: INotificationProps) {
  const navigate = useNavigate()
  const [updateViewedMutration] = useUpdateNotificationSeenMutation()

  const CommentContentWrapper = styled.div`
    a,
    p,
    div,
    span {
      font-size: 1rem !important;
    }
  `

  function toOrderDetailPageHandler() {
    navigate(openOrderDetailPage(data.order?.id ?? 0))
    updateViewedMutration({ variables: { ID: data.id, Seen: true } })
  }

  if (!data.order) return <>Не удалось найти заказ</>

  return (
    <Stack>
      <Sheet
        sx={{ p: 1, borderRadius: 'lg' }}
        variant={!data.seen ? 'soft' : 'plain'}
      >
        <Box sx={{ display: 'grid' }}>
          <Stack direction={'row'} gap={1}>
            <P fontWeight={500} color="neutral">
              {data.comment.user.first_name} {data.comment.user.last_name}
            </P>
            <P>
              упомянул вас{' '}
              {moment(data.comment.created_at).format('DD MMM H:mm')}{' '}
            </P>
          </Stack>

          <Row justifyContent={'space-between'}>
            <P fontWeight={600}>
              {data.order.contractor}__{data.order.city}
            </P>
            <Stack justifyContent={'flex-end'}>
              <Button
                size="sm"
                onClick={toOrderDetailPageHandler}
                color="primary"
              >
                Посмотреть
              </Button>
            </Stack>
          </Row>
        </Box>

        <Box p={0.1}>
          <CommentContentWrapper
            dangerouslySetInnerHTML={{ __html: data.comment.text }}
          ></CommentContentWrapper>
        </Box>
      </Sheet>
    </Stack>
  )
}

export function MentionList() {
  const { store }: any = useContext(Context)

  const [notifications, setNotifications] = useState<{
    unviewed: TNotification[]
    viewed: TNotification[]
  }>({ unviewed: [], viewed: [] })

  const { loading } = useGetNotificationsSubscription({
    onData(options) {
      if (!options.data.data) throw Error(options.data.error?.stack)

      const data = options.data.data.orders_notifications

      setNotifications({
        unviewed: data.filter(e => !e.seen),
        viewed: data.filter(e => e.seen)
      })
    },
    variables: {
      _eq: store?.user?.id,
      limit: 100
    }
  })

  return (
    <Container>
      <NavigationBar t="Упоминания" />
      <Stack direction={'column'} gap={2}>
        {/* unreaderd notifs */}
        {notifications.unviewed.length ? (
          <Stack gap={1}>
            <SectionTitle title="Новые" />
            <Box>
              <ExecuteAction
                disabled={notifications.unviewed.length === 0}
                buttonProps={{
                  color: 'neutral',
                  variant: 'soft',
                  size: 'sm'
                }}
                buttonLabel="Прочитать все"
                onSubmit={() => {
                  return rpc.markAllNotificationsAsRead.mutate({
                    userId: store?.user?.id
                  })
                }}
              />
            </Box>
            {!loading &&
              notifications?.unviewed.map((e, index) => (
                <Mention key={index} data={e} />
              ))}
          </Stack>
        ) : null}

        {/* viewed notifs */}
        <Stack gap={1}>
          <SectionTitle title="Просмотренные" />
          {!loading &&
            notifications?.viewed.map((mention, index) => (
              <Mention data={mention} key={index} />
            ))}
        </Stack>
      </Stack>
    </Container>
  )
}

function SectionTitle({ title }: { title: string }) {
  return (
    <P level="title-md" color="primary">
      {title}
    </P>
  )
}
