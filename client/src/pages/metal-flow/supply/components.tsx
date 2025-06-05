/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box, Sheet, Typography } from '@mui/joy'
import { PageTitle } from 'components'
import { Table } from 'components/table.impl'
import { Material } from 'domain-model'
import { MetalFlowRoutes, openMetalFlowPage } from 'lib/routes'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import { AddResourceButton, SendMutation } from 'shortcuts'
import { QtyInputWithUnit, SmallInputForm } from '../shared'
import { MaterialSelect } from '../shared/material-select'
import { t } from '../text'
import { getColumns } from './columns.decl'
import { supplyStore } from './supply.store'

export const ListSupplies = observer(() => {
  const [key, setKey] = useState(0)

  return (
    <>
      <PageTitle title={t.SuppliesList} hideIcon>
        <AddResourceButton
          navigateTo={openMetalFlowPage(MetalFlowRoutes.supply_add)}
        />
      </PageTitle>
      {supplyStore.supplies.length === 0 && (
        <Typography>Нет поставок</Typography>
      )}
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
    </>
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
    <SmallInputForm header={t.SupplyAdd}>
      <MaterialSelect
        setMaterial={setMaterial}
        material={material}
        currentQty={supplyStore.qty.toString()}
      />
      <QtyInputWithUnit
        unitId={material?.unit}
        value={qty}
        setValue={setQty}
        label={t.Qty}
      />
      <SendMutation onClick={save} />
    </SmallInputForm>
  )
}
