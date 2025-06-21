import { FullscreenDialog } from 'components/fullscreen.dialog'
import { observer } from 'lib/deps'
import { Label, P, Row } from 'lib/index'
import { MaterialsListPage } from '../../material/material_list'
import { QtyInputWithUnit } from '../../metalflow_shared'
import { WriteoffOpenListButton } from '../writeoff.shared'
import { writeoffStore as store } from '../writeoff.store'

export const WriteOffThroughMaterial = observer(() => {
  return (
    <>
      <Row gap={3}>
        <Row sx={{ fontSize: 20 }}>
          <Label>Материал: </Label>
          <P fontWeight={600} color="primary" sx={{ whiteSpace: 'nowrap' }}>
            {store.throughMaterial.material?.label}
          </P>
        </Row>
        <FullscreenDialog
          openButton={<WriteoffOpenListButton />}
          open={store.throughMaterial.dialogOpen}
          setOpen={v => store.throughMaterial.setDialogOpen(v)}
        >
          <MaterialsListPage
            onRowClick={m => {
              store.throughMaterial.setMaterial(m)
              store.throughMaterial.setDialogOpen(false)
            }}
            highlight={m => m.id == store.throughMaterial.material?.id}
            highlightColor="#97c3f098"
          />
        </FullscreenDialog>
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
