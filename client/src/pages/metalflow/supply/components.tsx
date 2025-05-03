/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { UilTrash } from '@iconscout/react-unicons'
import { Box, IconButton, Sheet, Stack } from '@mui/joy'
import { useEffect, useState } from 'react'
import { Material } from 'shared/domain'
import { useInsertMaterialSupplyMutation } from 'src/types/graphql-shema'
import { PageTitle } from '../../../components'
import { MetalFlowSys } from '../../../lib/routes'
import { AddButton, SendMutation } from '../../../shortcuts'
import {
  useDeleteSupplyMutation,
  useGetSuppliesQuery
} from '../../../types/graphql-shema'
import { emitNotification } from '../../../utils/notification'
import { QtyInputWithUnit, SmallInputForm } from '../shared'
import { MaterialSelect } from '../shared/material-select'
import { Table } from '../shared/table.impl'
import { goTo } from '../spa'
import { useStockStore } from '../stock'
import { t } from '../text'
import { getColumns } from './columns.decl'

export function SuppliesList() {
  const { data, refetch } = useGetSuppliesQuery()
  const [key, setKey] = useState(0)

  return (
    <>
      <PageTitle title={t.SuppliesList}>
        <AddButton navigateTo={goTo(MetalFlowSys.supply_add)} />
      </PageTitle>
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
            columns={getColumns({ key, setKey, refetch })}
            data={data?.metal_pdo_supplies || []}
          />
        </Box>
      </Sheet>
    </>
  )
}

export function AddSuply() {
  const [qty, setQty] = useState<string>('')
  const [key, setKey] = useState(0)
  const [material, setMaterial] = useState<Material>()
  const stockStore = useStockStore()
  const [mut, { data, loading, error, reset }] =
    useInsertMaterialSupplyMutation()

  const save = async () => {
    await mut({
      variables: {
        object: {
          material_id: material?.id,
          qty,
          supplied_at: new Date(),
          supplier_name: ''
        }
      }
    })
    setQty('')
    setKey(key + 1)
    setTimeout(reset, 5000)
    stockStore.load()
  }

  return (
    <SmallInputForm header={t.SupplyAdd}>
      <MaterialSelect
        setMaterial={setMaterial}
        material={material}
        key={key}
        currentQty={stockStore.getPrecise(material)}
      />
      <QtyInputWithUnit
        unitId={material?.unitId}
        value={qty}
        setValue={setQty}
        label={t.Qty}
      />
      <SendMutation onClick={save} />
    </SmallInputForm>
  )
}

export function DeleteSupply(props: { supplyId: number; refetch: () => void }) {
  const [mut, { data }] = useDeleteSupplyMutation({
    variables: {
      id: props.supplyId
    }
  })

  useEffect(() => {
    if (data) {
      console.log('delete success')
      emitNotification('success', 'Событие поствки удалено')
    }
  }, [data])

  return (
    <Stack direction="row-reverse" gap={1} className="delete-btn">
      <IconButton
        sx={{
          opacity: 0.8
        }}
        onClick={async () => {
          await mut()
          props.refetch()
        }}
      >
        <UilTrash width={16} height={16} />
      </IconButton>
    </Stack>
  )
}
