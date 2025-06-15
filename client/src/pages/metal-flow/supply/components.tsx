/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Sheet, Stack } from '@mui/joy'
import { PageTitle } from 'components'
import { Table } from 'components/table.impl'
import { Material } from 'domain-model'
import { open, routeMap } from 'lib/routes'
import { AddResourceButton, P, Row, SendMutation } from 'lib/shortcuts'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { QtyInputWithUnit } from '../shared'
import { t } from '../text'
import { getColumns } from './columns.decl'
import { supplyStore } from './supply.store'

export const ListSupplies = observer(() => {
  const [key, setKey] = useState(0)
  return (
    <Stack py={1}>
      <PageTitle subTitle={t.SuppliesList} hideIcon>
        <AddResourceButton navigateTo={open(routeMap.metalflow.supply.new)} />
      </PageTitle>
      {supplyStore.supplies.length === 0 && <P>Нет поставок</P>}
      <Sheet sx={{ gap: 2 }}>
        <Box
          css={css`
            .delete-btn {
              opacity: 0;
              visibility: hidden;
            }

            tr:hover {
              .delete-btn {
                opacity: 1;
                visibility: visible;
              }
            }
          `}
        >
          <Table
            columns={getColumns({ key, setKey })}
            data={supplyStore.supplies}
          />
        </Box>
      </Sheet>
    </Stack>
  )
})

export function AddSuply() {
  const [qty, setQty] = useState<string>('')
  const [material, setMaterial] = useState<Material>()

  const save = async () => {
    if (!material) throw Error('Material is not selected')
    if (!qty) throw Error('Qty is not set')
    const id = await supplyStore.insertSupply(material.id, Number(qty))
    // TODO: optimize this
    supplyStore.reset()
    supplyStore.load()
    return id
  }

  return (
    <Stack gap={2} py={2}>
      <PageTitle subTitle={t.AddSupply} hideIcon />
      <Row>
        <P>Материал</P>
        <P>{material?.label}</P>
      </Row>
      <QtyInputWithUnit
        unitId={material?.unit}
        value={qty}
        setValue={setQty}
        label={t.Qty}
      />
      <SendMutation onClick={save} />
    </Stack>
  )
}
