/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import { FactoryPage } from 'components/factory_page'
import {
  ActionButton,
  Box,
  Button,
  observer,
  P,
  Row,
  Sheet,
  Stack,
  useNavigate,
  useState
} from 'lib/index'
import { openOrderDetailPage } from 'lib/routes'
import { matrixDecoder } from 'lib/rpc/matrix_decoder'
import { rpc } from 'lib/rpc/rpc.client'
import { authStore } from 'lib/store/auth.store'
import moment from 'moment'
import { useEffect } from 'react'
import { Mention } from 'srv/rpc/orders/mentions'

function MentionComponent({ data }: { data: Mention }) {
  const navigate = useNavigate()
  const CommentContentWrapper = styled.div`
    a,
    p,
    div,
    span {
      font-size: 1rem !important;
      margin: 0;
    }
  `
  function handleMentionCheck() {
    navigate(openOrderDetailPage(data.order_id ?? 0))
    rpc.orders.mentions.checked.mutate({
      id: data.id
    })
  }
  if (!data.order_id) return <>Не удалось найти заказ</>
  return (
    <Stack>
      <Sheet
        sx={{ p: 1, borderRadius: 'lg' }}
        variant={!data.seen ? 'soft' : 'outlined'}
      >
        <Box sx={{ display: 'grid' }}>
          <Stack direction={'row'} gap={1}>
            <P fontWeight={500} color="neutral">
              {data.first_name} {data.last_name}
            </P>
            <P>упомянул вас {moment(data.created_at).format('DD MMM H:mm')} </P>
          </Stack>

          <Row justifyContent={'space-between'}>
            <P fontWeight={600}>
              {data.contractor}__{data.city}
            </P>
            <Stack justifyContent={'flex-end'}>
              <Button
                size="sm"
                variant="soft"
                onClick={handleMentionCheck}
                color="primary"
              >
                Посмотреть
              </Button>
            </Stack>
          </Row>
        </Box>
        <Box p={0.1}>
          <CommentContentWrapper
            dangerouslySetInnerHTML={{ __html: data.text }}
          ></CommentContentWrapper>
        </Box>
      </Sheet>
    </Stack>
  )
}

export const MentionList = observer(() => {
  const [notifications, setNotifications] = useState<{
    unseen: Mention[]
    seen: Mention[]
  }>({ unseen: [], seen: [] })

  const [loading, setLoading] = useState(false)
  useEffect(() => {
    if (!authStore.user?.id) return
    setLoading(true)
    rpc.orders.mentions.list
      .query({
        user_id: authStore.user.id
      })
      .then(res => {
        const unseen = matrixDecoder<Mention>(res.unseen)
        const seen = matrixDecoder<Mention>(res.seen)
        setNotifications({
          unseen,
          seen
        })
      })
      .finally(() => setLoading(false))
  }, [])

  return (
    <FactoryPage title="Упоминания">
      <Stack direction={'column'} maxWidth={'800px'} margin={'0 auto'}>
        {/* unreaderd notifs */}
        {notifications.unseen.length ? (
          <Stack gap={1}>
            <SectionTitle title="Новые" />
            <Box>
              <ActionButton
                disabled={notifications.unseen.length === 0}
                props={{
                  color: 'neutral',
                  variant: 'soft',
                  size: 'sm'
                }}
                label="Прочитать все"
                onClick={() => rpc.read_notifications.mutate()}
              />
            </Box>
            {!loading &&
              notifications?.unseen.map((e, index) => (
                <MentionComponent key={index} data={e} />
              ))}
          </Stack>
        ) : null}
        {/* viewed notifs */}
        <Stack gap={1}>
          <SectionTitle title="Просмотренные" />
          {!loading &&
            notifications?.seen.map((mention, index) => (
              <MentionComponent data={mention} key={index} />
            ))}
        </Stack>
      </Stack>
    </FactoryPage>
  )
})

function SectionTitle({ title }: { title: string }) {
  return (
    <P level="title-md" color="primary">
      {title}
    </P>
  )
}
