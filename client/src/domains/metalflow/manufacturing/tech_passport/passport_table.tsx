/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box } from '@mui/joy'
import { cache } from 'domains/metalflow/cache/root'
import { TechParamsRowDisplay } from 'domains/metalflow/detail/components'
import { capitalize } from 'domains/metalflow/shared'
import { Label, observer, P } from 'lib/index'
import { formatDate } from 'lib/utils/formatting'
import { ReactNode } from 'react'
import { ManufacturingOrderState } from '../order.state'
import { tableStyles } from './shared'

type Props = {
  order: ManufacturingOrderState
}

const emptySpace = <Box width={30} height={30} />

const L = (props: { children: ReactNode }) => (
  <Label level={'body-xs'}>{props.children}</Label>
)

export const DetailTechPassportTable = observer((props: Props) => {
  const s = props.order
  const materialCost = s.detail.autoWriteoff.materialCost
  if (!s.order) return
  return (
    <table css={css(tableStyles)} style={{ textAlign: 'center' }}>
      <tbody>
        <tr>
          <td>
            <L>Обозначение детали</L>
            <P fontSize={14}>{s.detail.drawingNumber}</P>
            <P fontSize={14}>{s.detail.drawingName}</P>
          </td>
          <td>Технологический паспорт № </td>
          <td width={70}>Заказ № {emptySpace}</td>
          <td width={70}>
            Кол. дет. в партии <P>{s.order?.qty || ''}</P>
          </td>
          <td width={50}>ОП</td>
          <td width={50}>Взрыв</td>
          <td>
            <L>Дата запуска в производство</L>
            {s.order.started_at && (
              <P>{formatDate(new Date(s.order.started_at))}</P>
            )}
          </td>
        </tr>

        <tr>
          <td>
            <L>Заготовка</L>
            <P fontSize={14} pb={1}>
              {materialCost?.materialId
                ? cache.materials.getLabel(materialCost.materialId)
                : ''}
            </P>
            <TechParamsRowDisplay fontSize={12} params={s.detail.blankSpec} />
          </td>
          <td colSpan={3}>
            <L>Наименование детали</L>
            <P>{capitalize(s.detail.name)}</P>
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
