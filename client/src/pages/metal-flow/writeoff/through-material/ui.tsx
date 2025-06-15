import { Box, Stack } from '@mui/joy'
import { ScrollPreserv } from 'components/scroll-preserve'
import { observer } from 'lib/deps'
import { P, Row } from 'lib/shortcuts'
import { MaterialList } from 'pages/metal-flow/material/material-list'
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
    <Stack sx={{ maxHeight: '100vh' }}>
      <Box p={1}></Box>
      <ScrollPreserv refreshTrigger={store.throughMaterial.material?.id}>
        <MaterialList
          onRowClick={m => {
            store.throughMaterial.setMaterial(m)
          }}
          highlight={m => m.id == store.throughMaterial.material?.id}
          highlightColor="#97c3f098"
        />
      </ScrollPreserv>
      <Box p={1}></Box>
    </Stack>
  )
})
