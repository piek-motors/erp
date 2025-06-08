/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import { UilArrowRight } from '@iconscout/react-unicons'
import { Box, Button, Container, Sheet, Stack } from '@mui/joy'
import { PageTitle } from 'components/page-title'
import { Context } from 'index'
import { openOrderDetailPage } from 'lib/routes'
import { P, Row, UseIcon } from 'lib/shortcuts'
import moment from 'moment'
import { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { TNotification } from 'types/global'
import {
  useGetNotificationsSubscription,
  useUpdateNotificationSeenMutation
} from 'types/graphql-shema'

interface INotificationProps {
  data: any
  readed?: boolean
}

function Mention({ data, readed }: INotificationProps) {
  const navigate = useNavigate()
  const [updateViewedMutration] = useUpdateNotificationSeenMutation()

  const Body = styled.div`
    a,
    p,
    div,
    span {
      font-size: 1rem !important;
      color: var(--highContrast) !important;
    }
  `

  function toOrderDetailPageHandler() {
    navigate(openOrderDetailPage(data.Order.OrderID))
    updateViewedMutration({ variables: { ID: data.ID, Seen: true } })
  }

  return (
    <Stack>
      <Sheet
        sx={{ p: 2 }}
        variant={readed ? 'soft' : 'plain'}
        color={readed ? 'neutral' : 'primary'}
      >
        <Box sx={{ display: 'grid' }}>
          <Stack direction={'row'} gap={1}>
            <P fontWeight={500} color="neutral">
              {data.Comment.User.FirstName} {data.Comment.User.LastName}
            </P>
            <P>
              упомянул вас{' '}
              {moment(data.Comment.Timestamp).format('DD MMM H:mm')}{' '}
            </P>
          </Stack>

          <Row>
            <P color="primary" fontWeight={600}>
              {data.Order.Entity}__{data.Order.City}
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
          <Body dangerouslySetInnerHTML={{ __html: data.Comment.Text }}></Body>
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

  const { data, loading } = useGetNotificationsSubscription({
    onData(options) {
      if (!options.data.data) throw Error(options.data.error?.stack)

      const data = options.data.data.orders_notifications

      setNotifications({
        unviewed: data.filter(e => !e.seen),
        viewed: data.filter(e => e.seen)
      })
    },
    variables: {
      _eq: store.user.UserID,
      limit: 100
    }
  })

  return (
    <Container>
      <PageTitle title="Упоминания" />
      <Stack direction={'column'} gap={2}>
        {/* unreaderd notifs */}
        {notifications.unviewed.length ? (
          <Box>
            <P level="h2">Непросмотренные </P>
            {!loading &&
              notifications?.unviewed.map((e, index) => (
                <Mention key={index} data={e} />
              ))}
          </Box>
        ) : null}

        {/* viewed notifs */}
        {!loading &&
          notifications?.viewed.map((e, index) => (
            <Mention data={e} key={index} />
          ))}
      </Stack>
    </Container>
  )
}
