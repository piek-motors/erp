/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box } from '@mui/joy'
import { capitalize } from 'domains/metalflow/shared'
import { Label, P } from 'lib/index'
import { ReactNode } from 'react'
import { formatDate } from '../list/list'
import { OrderState } from '../order.state'
import { tableStyles } from './shared'
type Props = {
  order: OrderState
}

const square = <Box width={30} height={30} />

const L = (props: { children: ReactNode }) => (
  <Label level={'body-xs'}>{props.children}</Label>
)

export function DetailTechPassportTable(props: Props) {
  const s = props.order
  const orderId = s.order?.id || ''
  const startedAt = s.order ? formatDate(new Date(s.order.started_at)) : ''
  const cost = s.detail.autoWriteoff.materialsCost[0]
  return (
    <table css={css(tableStyles)} style={{ textAlign: 'center' }}>
      <tbody>
        <tr>
          <td>ООО ПЭК</td>
          <td colSpan={9}>Технологический паспорт №{s.detail.id}</td>
          <td>ОП</td>
          <td>Взрыв</td>
          <td>
            <L>Дата запуска в производство</L>
            <Box width={50} height={30}></Box>
          </td>
        </tr>
        <tr>
          <td colSpan={3}>
            <L>Обозначение детали</L>
            <Box>{s.detail.drawingNumber}</Box>
          </td>
          <td colSpan={3}>
            <L>Наименование детали</L>
            <P fontWeight={600} level="body-md" color="primary">
              {capitalize(s.detail?.name)}
            </P>
            {cost && (
              <Box>
                Заготовка {cost.material?.label} - <b>{cost.length} мм</b>
              </Box>
            )}
          </td>
          <td width={70}>
            Заказ № <div>{s.order?.id}</div>
          </td>
          <td width={70}>Кол. дет. в партии {square}</td>

          <td colSpan={6} style={{ padding: 0 }}>
            <L>Поступление на склад</L>
            <table css={css(tableStyles)} style={{ border: 'none' }}>
              <tbody>
                <tr>
                  <td>
                    <L>Дата</L> {square}
                  </td>
                  <td width={'20%'}>
                    <L>Кол.</L> {square}
                  </td>
                  <td>
                    <L>Принял</L> {square}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        {s.detail.description && (
          <tr>
            <td colSpan={13}>
              <L>Примечание</L>
              <Box>{s.detail.description}</Box>
            </td>
          </tr>
        )}
      </tbody>
    </table>
  )
}
