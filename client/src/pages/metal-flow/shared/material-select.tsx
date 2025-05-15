import { Box, Typography } from '@mui/joy'
import { useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Material } from '../../../../../domain-model/dist'
import { useGetMaterialsQuery } from 'types/graphql-shema'
import { map } from '../mappers'
import { useStockStore } from '../stock'
import { t } from '../text'
import { MaterialAutocomplete } from './material-autocomplete'
import { ResourceName } from './material-name'

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
        <Typography>{t.Material}:</Typography>
        <ResourceName resource={props.material?.getLabelProps()} />
        <Typography>
          {t.Remaining}: {stockStore.getPrecise(material)}
        </Typography>
      </Box>
    )
  }

  return (
    <MaterialAutocomplete data={data} value={material} onChange={setMaterial} />
  )
}
