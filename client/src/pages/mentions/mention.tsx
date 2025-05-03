/** @jsxImportSource @emotion/react */
import styled from '@emotion/styled'
import { UilArrowRight } from '@iconscout/react-unicons'
import { Box, Button, Sheet, Stack, Typography } from '@mui/joy'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

import { useUpdateViewedMutation } from 'src/types/graphql-shema'
import { Row } from '../../shortcuts'

interface INotificationProps {
  data: any
  readed?: boolean
}

export function Mention({ data, readed }: INotificationProps) {
  const navigate = useNavigate()
  const [updateViewedMutration] = useUpdateViewedMutation()

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
    navigate(`/orders/${data.Order.OrderID}`)
    updateViewedMutration({ variables: { ID: data.ID, Viewed: true } })
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
            <Typography fontWeight={500} color="neutral">
              {data.Comment.User.FirstName} {data.Comment.User.LastName}
            </Typography>
            <Typography>
              упомянул вас{' '}
              {moment(data.Comment.Timestamp).format('DD MMM H:mm')}{' '}
            </Typography>
          </Stack>

          <Row>
            <Typography color="primary" fontWeight={600}>
              {data.Order.Entity}__{data.Order.City}
            </Typography>

            <Box>
              <Button
                onClick={toOrderDetailPageHandler}
                variant="plain"
                color="neutral"
              >
                К заказу <UilArrowRight />
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
