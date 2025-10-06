/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box } from '@mui/joy'
import { TechParamsDisplay } from 'domains/metalflow/detail/components'
import { DetailName } from 'domains/metalflow/detail/name'
import { Label, observer, P, Row } from 'lib/index'
import { ReactNode } from 'react'
import { ManufacturingOrderState } from '../order.state'
import { DetailDescription, tableStyles } from './shared'

type Props = {
  order: ManufacturingOrderState
}

const emptySpace = <Box width={30} height={30} />

const L = (props: { children: ReactNode }) => (
  <Label level={'body-xs'}>{props.children}</Label>
)

export const DetailTechPassportTable = observer((props: Props) => {
  const s = props.order
  const materialCost = s.detail.autoWriteoff.materialsCost.find(e => e)
  const blankLength = s.detail.technicalParameters?.arr.find(
    p => p.key.trim() === 'L'
  )?.value

  if (!s.order) return
  return (
    <table css={css(tableStyles)} style={{ textAlign: 'center' }}>
      <tbody>
        <tr>
          <td>ООО ПЭК</td>
          <td colSpan={9}>Технологический паспорт № </td>
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
            <Row justifyContent={'center'}>
              <DetailName
                withLink
                withParamsButton
                detail={{
                  id: s.order.detail_id,
                  name: s.order.detail_name,
                  group_id: s.order.group_id || null
                }}
              />
            </Row>
            {materialCost && (
              <Box>
                Заготовка {materialCost.material?.label} -{' '}
                {blankLength && <b>{blankLength} мм</b>}
              </Box>
            )}
          </td>
          <td width={70}>Заказ № {emptySpace}</td>
          <td width={70}>
            Кол. дет. в партии <P>{s.order?.qty || ''}</P>
          </td>

          <td colSpan={6} style={{ padding: 0 }}>
            <L>Поступление на склад</L>
            <table css={css(tableStyles)} style={{ border: 'none' }}>
              <tbody>
                <tr>
                  <td>
                    <L>Дата</L> {emptySpace}
                  </td>
                  <td width={'20%'}>
                    <L>Кол.</L> {emptySpace}
                  </td>
                  <td>
                    <L>Принял</L> {emptySpace}
                  </td>
                </tr>
              </tbody>
            </table>
          </td>
        </tr>
        <tr>
          <td colSpan={4}>
            <L>Тех. параметры</L>
            <TechParamsDisplay
              level="body-xs"
              params={s.detail.technicalParameters}
            />
          </td>
          {s.detail.description && (
            <td colSpan={9}>
              <DetailDescription htmlContent={s.detail.description} />
            </td>
          )}
        </tr>
      </tbody>
    </table>
  )
})
