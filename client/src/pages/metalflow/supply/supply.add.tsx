import { Button } from '@mui/material'
import { useState } from 'react'
import { MetalFlowSys } from 'src/lib/routes'
import { Material } from 'src/pages/metalflow/domain/material'
import { useInsertMaterialSupplyMutation } from 'src/types/graphql-shema'
import { ErrorHint, GenericForm, QtyInputWithUnit, SavedHint } from '../shared'
import { MaterialSelect } from '../shared/material-select'
import { useStockStore } from '../stock'
import { t } from '../text'

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
    <GenericForm header={t.SupplyAdd} goBackUrl={MetalFlowSys.materials}>
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
    </GenericForm>
  )
}
