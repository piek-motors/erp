import { observer } from 'lib/deps'
import { P, Row } from 'lib/shortcuts'
import { MaterialsListPage } from 'pages/metal-flow/material/material-list'
import { QtyInputWithUnit } from '../../shared'
import { writeoffStore as store } from '../writeoff.store'

export const WriteOffThroughMaterial = observer(() => {
  return (
    <>
      <Row>
        <P>Материал</P>
        <P>{store.throughMaterial.material?.label}</P>
      </Row>
      <QtyInputWithUnit
        label="Вес"
        setValue={v => store.throughMaterial.setWeight(v)}
        unitId={store.throughMaterial.material?.unit}
        value={store.throughMaterial.weight.toString()}
      />
    </>
  )
})

export const WriteOffThroughMaterialSidePanel = observer(() => {
  return (
    <MaterialsListPage
      onRowClick={m => {
        store.throughMaterial.setMaterial(m)
      }}
      highlight={m => m.id == store.throughMaterial.material?.id}
      highlightColor="#97c3f098"
    />
  )
})
