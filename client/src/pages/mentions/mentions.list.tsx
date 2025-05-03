import { Box, Container, Stack, Typography } from '@mui/joy'
import { useContext, useState } from 'react'
import { TNotification } from 'src/types/global'
import { useGetNotificationsSubscription } from 'src/types/graphql-shema'
import { Context } from '../..'

import { AppRoutes } from '../../lib/routes'
import { Mention } from './mention'

export function MentionList() {
  const { store }: any = useContext(Context)
  const [notifications, setNotifications] = useState<{
    unviewed: TNotification[]
    viewed: TNotification[]
  }>({ unviewed: [], viewed: [] })
  const [state, setState] = useState(false)

  const { data, loading } = useGetNotificationsSubscription({
    onData(options) {
      if (!options.data.data) throw Error(options.data.error?.stack)

      const data = options.data.data.erp_Notifications

      setNotifications({
        unviewed: data.filter(e => !e.Viewed),
        viewed: data.filter(e => e.Viewed)
      })
    },
    variables: {
      _eq: store.user.UserID,
      limit: 100
    }
  })

  const toggleDrawer = (open: boolean) => {
    setState(open)
  }

  function closeNotificationCenter() {
    setState(false)
  }

  return (
    <Container>
      <Stack direction={'column'} gap={2}>
        {/* unreaderd notifs */}
        {notifications.unviewed.length ? (
          <Box>
            <Typography level="h2">Непросмотренные </Typography>
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

export default [
  {
    element: <MentionList />,
    path: AppRoutes.mentions
  }
]
