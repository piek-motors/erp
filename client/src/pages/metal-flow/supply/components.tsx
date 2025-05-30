/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { UilTrash } from '@iconscout/react-unicons'
import { Box, IconButton, Sheet, Stack } from '@mui/joy'
import { PageTitle } from 'components'
import { Table } from 'components/table.impl'
import { Material } from 'domain-model'
import { MetalFlowRoutes, openMetalFlowPage } from 'lib/routes'
import { useState } from 'react'
import { AddResourceButton, SendMutation } from 'shortcuts'
import { useNotifier } from 'store/notifier.store'
import {
  useDeleteSupplyMutation,
  useGetSuppliesQuery,
  useInsertMaterialSupplyMutation
} from 'types/graphql-shema'
import { QtyInputWithUnit, SmallInputForm } from '../shared'
import { MaterialSelect } from '../shared/material-select'
import { useStockStore } from '../stock'
import { t } from '../text'
import { getColumns } from './columns.decl'

export function ListSupplies() {
  const { data, refetch } = useGetSuppliesQuery()
  const [key, setKey] = useState(0)

  return (
    <>
      <PageTitle title={t.SuppliesList} hideIcon>
        <AddResourceButton
          navigateTo={openMetalFlowPage(MetalFlowRoutes.supply_add)}
        />
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
            data={data?.metal_flow_supplies || []}
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
        unitId={material?.unit}
        value={qty}
        setValue={setQty}
        label={t.Qty}
      />
      <SendMutation onClick={save} />
    </SmallInputForm>
  )
}

export function DeleteSupply(props: { supplyId: number; refetch: () => void }) {
  const notifier = useNotifier()
  const [mut] = useDeleteSupplyMutation({
    variables: {
      id: props.supplyId
    },
    onCompleted() {
      notifier.notify('info', 'Событие поствки удалено')
    },
    onError(e) {
      notifier.notify('err', e.message)
    }
  })

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
