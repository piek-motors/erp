/** @jsxImportSource @emotion/react */
import { Stack } from '@mui/joy'
import { PageTitle } from 'components'
import { FullscreenDialog } from 'components/fullscreen.dialog'
import { EnWriteoffType } from 'domain-model'
import { observer } from 'lib/deps'
import { Label, P, Row, SendMutation } from 'lib/index'
import { WriteoffReasonSelect } from 'metalflow/writeoffs/writeoff.shared'
import { QtyInputWithUnit } from '../../shared/qty_input_with_unit'
import { t } from '../../text'
import { WriteoffOpenListButton } from '../../writeoffs/writeoff.shared'
import { writeoffStore as store } from '../../writeoffs/writeoff.store'
import { MaterialListPage } from '../list/list'

export const MaterialWriteoffPage = observer(() => {
  const creationForrbidden = store.validate() !== undefined
  const error = () => {
    if (creationForrbidden) {
      return (
        <P color="danger" level="body-sm">
          {store.validate()?.message}
        </P>
      )
    }
  }
  return (
    <Stack p={0} px={2}>
      <Stack gap={2} py={2}>
        <PageTitle subTitle={t.WriteOffAdd} hideIcon />
        <WriteoffReasonSelect />
        <WriteOffThroughMaterial />
        <SendMutation
          disabled={creationForrbidden}
          onClick={async () => {
            return await store.insert()
          }}
        />
        {error()}
      </Stack>
    </Stack>
  )
})

const WriteOffThroughMaterial = observer(() => {
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
          <MaterialListPage
            onRowClick={m => {
              store.setType(EnWriteoffType.ThroughMaterial)
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
