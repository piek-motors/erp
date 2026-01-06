/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box } from '@mui/joy'
import { cache } from 'domains/pdo/cache/root'
import { DetailSt } from 'domains/pdo/detail/detail.state'
import { TechParamsRowDisplay } from 'domains/pdo/detail/inputs'
import { capitalize } from 'domains/pdo/shared'
import { Label, observer, P } from 'lib/index'
import { fmtDate } from 'lib/utils/date_fmt'
import { ReactNode } from 'react'
import { OrderSt } from '../order.state'
import { tableStyles } from './shared'

type Props = {
  order: OrderSt
  detail: DetailSt
}

const emptySpace = <Box width={30} height={30} />

const L = (props: { children: ReactNode }) => (
  <Label level={'body-xs'}>{props.children}</Label>
)

export const TechPassportTable = observer(({ order, detail }: Props) => {
  const materialCost = detail.autoWriteoff.materialCost
  if (!order.resp) return
  return (
    <table css={css(tableStyles)} style={{ textAlign: 'center' }}>
      <tbody>
        <tr>
          <td>
            <L>Обозначение детали</L>
            <P fontSize={14}>{detail.drawingNumber}</P>
            <P fontSize={14}>{detail.drawingName}</P>
          </td>
          <td>Технологический паспорт № {order.id}</td>
          <td width={70}>Заказ № {emptySpace}</td>
          <td width={70}>
            Кол. дет. в партии <P>{order.qty || ''}</P>
          </td>
          <td width={50}>ОП</td>
          <td width={50}>Взрыв</td>
          <td>
            <L>Дата запуска в производство</L>
            {order.resp.started_at && (
              <P>{fmtDate(new Date(order.resp.started_at))}</P>
            )}
          </td>
        </tr>

        <tr>
          <td style={{ maxWidth: '30%', width: '20%' }}>
            <L>Заготовка</L>
            <P fontSize={14} pb={0.5} fontWeight={500}>
              {materialCost?.materialId
                ? cache.materials.getLabel(materialCost.materialId)
                : ''}
            </P>
            <TechParamsRowDisplay fontSize={14} params={detail.blankSpec} />
          </td>
          <td colSpan={3}>
            <L>Наименование детали</L>
            <P fontWeight={500} fontSize={16}>
              {capitalize(detail.name)}
            </P>
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
  )
})
