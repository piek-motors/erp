import { ScrollPreserv } from 'components/scroll-preserve'
import { observer } from 'lib/deps'
import { P, Row } from 'lib/shortcuts'
import { MaterialList } from 'pages/metal-flow/material/material-list'
import { QtyInputWithUnit } from '../../shared'
import { t } from '../../text'
import { writeoffStore as store } from '../writeoff.store'

export const WriteOffThroughMaterial = observer(() => {
  return (
    <>
      <Row>
        <P>Материал</P>
        <P>{store.throughMaterial.material?.label}</P>
      </Row>
      <QtyInputWithUnit
        label={t.Qty}
        setValue={v => store.throughMaterial.setQty(v)}
        unitId={store.throughMaterial.material?.unit}
        value={store.throughMaterial.qty.toString()}
      />
    </>
  )
})

export const WriteOffThroughMaterialSidePanel = observer(() => {
  return (
    <ScrollPreserv refreshTrigger={store.throughMaterial.material?.id}>
      <MaterialList
        onRowClick={m => {
          store.throughMaterial.setMaterial(m)
        }}
        highlight={m => m.id == store.throughMaterial.material?.id}
        highlightColor="#97c3f098"
      />
    </ScrollPreserv>
  )
})
