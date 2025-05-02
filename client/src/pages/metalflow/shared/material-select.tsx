import { Box } from '@mui/material'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Material } from 'shared/domain'
import { P } from 'src/shortcuts'
import { useGetMaterialsQuery } from 'src/types/graphql-shema'
import { map } from '../domain-adapter'
import { useStockStore } from '../stock'
import { MaterialAutocomplete } from './material-autocomplete'

export function MaterialSelect(props: {
  setMaterial: (m: Material) => void
  material?: Material
  multipleValues?: boolean
  currentQty?: string
}) {
  const { setMaterial, material } = props
  const [searchParams] = useSearchParams()
  const materialid = searchParams.get('material_id')
  const { data } = useGetMaterialsQuery({ fetchPolicy: 'network-only' })
  const stockStore = useStockStore()

  useEffect(() => {
    if (data) {
      if (!materialid) return

      const m = data?.metal_pdo_materials.find(each => each.id === +materialid)
      if (!m) throw Error(`material with this id not found`)

      setMaterial(map.material.fromDto(m))
    }
  }, [data])

  if (materialid) {
    return (
      <Box>
        <P>Материал: {material?.getIdentifier()}</P>
        <P>Текущий остаток: {stockStore.getPrecise(material)}</P>
      </Box>
    )
  }

  return (
    <MaterialAutocomplete data={data} value={material} onChange={setMaterial} />
  )
}
