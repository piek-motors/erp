/** @jsxImportSource @emotion/react */

import { css } from '@emotion/react'
import { Box } from '@mui/joy'
import { UiOrderPriority } from 'models'
import type { ReactNode } from 'react'
import type { DetailSt } from '@/domains/pdo/detail/detail.state'
import { Label, observer, P, Row } from '@/lib/index'
import { fmtDate } from '@/lib/utils/date_fmt'
import { DetailName } from '../../detail/detail_name'
import { DetailBlank } from '../detail_blank'
import type { OrderSt } from '../order.state'
import { tableStyles } from './shared'

type Props = {
  order: OrderSt
  detail: DetailSt
}

const emptySpace = <Box width={30} height={30} />

const L = (props: { children: ReactNode }) => (
  <Label level={'body-xs'} fontSize={10} lineHeight={1}>
    {props.children}
  </Label>
)

export const TechPassportTable = observer(({ order, detail }: Props) => {
  if (!order.resp) return
  return (
    <>
      <Row my={0.5} justifyContent={'center'}>
        <Row>
          <P fontSize={13}>Технологический паспорт</P>
          <P fontSize={16}>№{order.id}</P>
        </Row>
        |
        <P fontSize={13}>
          {order.priority != null && UiOrderPriority[order.priority]} приоритет
        </P>
      </Row>
      <table css={css(tableStyles)} style={{ textAlign: 'center' }}>
        <tbody>
          <tr>
            <td rowSpan={2} style={{ textAlign: 'left', maxWidth: 200 }}>
              <L>Заготовка</L>
              <DetailBlank order={order} blank={detail.blank} />
            </td>
            <td>
              <L>Обозначение детали</L>
              <P fontSize={15}>{detail.drawing_number}</P>
              <P fontSize={15}>{detail.drawing_name}</P>
            </td>
            <td width={70}>
              <L>Заказ №</L>
              {emptySpace}
            </td>
            <td width={70}>
              <L>Кол. дет. в партии</L>
              <P>{order.qty || ''}</P>
            </td>
            <td width={50}>ОП</td>
            <td width={50}>Взрыв</td>
            <td>
              <L>Запуск в пр-во</L>
              {order.resp.started_at && (
                <P>{fmtDate(new Date(order.resp.started_at))}</P>
              )}
            </td>
          </tr>

          <tr>
            <td colSpan={3} style={{ verticalAlign: 'inherit' }}>
              <DetailName
                detail={detail}
                with_group_name
                with_id
                disable_link
                sx={{
                  row: {
                    fontWeight: 500,
                    fontSize: 17,
                    justifyContent: 'center',
                  },
                }}
              />
            </td>

            <td colSpan={6} style={{ padding: 0 }}>
              <L>Поступление на склад</L>
              <table css={css(tableStyles)} style={{ border: 'none' }}>
                <tbody>
                  <tr>
                    <td style={{ borderBottom: 'none', borderLeft: 'none' }}>
                      <L>Дата</L> {emptySpace}
                    </td>
                    <td width={'20%'} style={{ borderBottom: 'none' }}>
                      <L>Кол.</L> {emptySpace}
                    </td>
                    <td style={{ borderBottom: 'none', borderRight: 'none' }}>
                      <L>Принял</L> {emptySpace}
                    </td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>
    </>
  )
})
