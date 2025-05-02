/** @jsxImportSource @emotion/react */
import { css } from '@emotion/react'
import { Box } from '@mui/material'
import { useState } from 'react'
import { PaperL1 } from '../../../components/paper'
import { MetalFlowSys } from '../../../lib/routes'
import { useGetSuppliesQuery } from '../../../types/graphql-shema'
import { ListPageHeader } from '../shared'
import { Table } from '../shared/table.impl'
import { t } from '../text'
import { getColumns } from './columns.decl'

export function SuppliesList() {
  const { data, refetch } = useGetSuppliesQuery()
  const [key, setKey] = useState(0)

  return (
    <>
      <ListPageHeader
        title={t.SuppliesList}
        btnText={t.SupplyAdd}
        goto={MetalFlowSys.supply_add}
      />
      <PaperL1 sx={{ gap: 2 }}>
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
      </PaperL1>
    </>
  )
}

import { Button } from '@mui/material'
import { Material } from 'shared/domain'
import { useInsertMaterialSupplyMutation } from 'src/types/graphql-shema'
import {
  ErrorHint,
  QtyInputWithUnit,
  SavedHint,
  SmallInputForm
} from '../shared'
import { MaterialSelect } from '../shared/material-select'
import { useStockStore } from '../stock'

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

  const btnDisabled = !qty

  return (
    <SmallInputForm header={t.SupplyAdd} goBackUrl={MetalFlowSys.materials}>
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
      <ErrorHint show={error} msg={error?.message} />
      <SavedHint show={data?.insert_metal_pdo_supplies_one} />
      <Button variant="contained" onClick={save} disabled={btnDisabled}>
        {t.Save}
      </Button>
    </SmallInputForm>
  )
}

import { UilTrash } from '@iconscout/react-unicons'
import { IconButton, Stack } from '@mui/material'
import { useEffect } from 'react'
import { useDeleteSupplyMutation } from '../../../types/graphql-shema'
import { notif } from '../../../utils/notification'

export function DeleteSupply(props: { supplyId: number; refetch: () => void }) {
  const [mut, { data, loading, error }] = useDeleteSupplyMutation({
    variables: {
      id: props.supplyId
    }
  })

  useEffect(() => {
    if (data) {
      console.log('delete success')
      notif('success', 'Событие поствки удалено')
    }
  }, [data])

  return (
    <Stack direction="row-reverse" gap={1} className="delete-btn">
      <IconButton
        size="small"
        color="error"
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
