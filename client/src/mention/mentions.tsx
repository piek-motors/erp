/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import { UilArrowRight } from '@iconscout/react-unicons'
import { Container } from '@mui/joy'
import { PageTitle } from 'components/page-title'
import { Context } from 'index'
import {
  Box,
  Button,
  P,
  Row,
  Sheet,
  Stack,
  UseIcon,
  useNavigate,
  useState
} from 'lib/index'
import { openOrderDetailPage } from 'lib/routes'
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

          <Row>
            <P fontWeight={600}>
              {data.order.contractor}__{data.order.city}
            </P>

            <Box>
              <Button
                onClick={toOrderDetailPageHandler}
                variant="soft"
                color="neutral"
              >
                <Row>
                  <P sx={{ whiteSpace: 'nowrap' }}>К заказу</P>
                  <UseIcon icon={UilArrowRight} />
                </Row>
              </Button>
            </Box>
          </Row>
        </Box>

        <Box p={1}>
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
    <Container sx={{ p: 1 }}>
      <PageTitle title="Упоминания" />
      <Stack direction={'column'} gap={2}>
        {/* unreaderd notifs */}
        {notifications.unviewed.length ? (
          <Stack gap={1}>
            <SectionTitle title="Новые" />
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
