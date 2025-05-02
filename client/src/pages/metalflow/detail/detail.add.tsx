import { Detail } from 'shared/domain'
import { MetalFlowSys } from 'src/lib/routes'
import { Input } from 'src/shortcuts'
import {
  useGetMaterialsQuery,
  useInsertDetailMutation
} from 'src/types/graphql-shema'
import { SmallInputForm } from '../shared'
import { MutationWithStatus, TakeLookHint } from '../shared/basic'
import { MaterialAutocompleteMulti } from '../shared/material-autocomplete'
import { goTo } from '../spa'
import { t } from '../text'
import { DetailMaterialPropInput } from './shared'
import { useDetail } from './state'

export function DetailAdd() {
  const [mut, { data, reset }] = useInsertDetailMutation()

  const state = useDetail()
  const handleSave = async () => {
    const res = await mut({
      variables: {
        object: {
          name: state.name,
          detail_materials: {
            data: state.materials.map(each => ({
              material_id: each.id,
              cost: state.materialCosts[each.id]
            }))
          }
        }
      }
    })
    state.setRecentlyAdded(new Detail(state.id, state.name, state.materials))
    if (res.errors?.length) {
      throw Error(res.errors.join('\n'))
    }
    return res.data?.insert_metal_pdo_details_one?.id
  }

  const mutResult = data?.insert_metal_pdo_details_one?.id

  if (mutResult) {
    setTimeout(() => {
      reset()
    }, 5000)
  }

  const actionSection = (
    <MutationWithStatus
      customComponent={(err, res) => (
        <TakeLookHint
          text={t.RecentlyNewDetailAdded}
          link={goTo(MetalFlowSys.detail_update, res)}
        />
      )}
      mutation={async () =>
        handleSave().then(res => {
          state.reset()
          return res
        })
      }
    />
  )

  const { data: materials } = useGetMaterialsQuery()

  return (
    <SmallInputForm
      header={t.AddDetail}
      goBackUrl={MetalFlowSys.details}
      lastSection={actionSection}
    >
      <Input
        label={t.DetailName}
        onChange={(event: any) => {
          state.setName(event.target.value)
        }}
        value={state.name}
        autoComplete={'off'}
      />

      <MaterialAutocompleteMulti
        data={materials}
        value={state.materials}
        onChange={m => state.setMaterials(m)}
      />

      <DetailMaterialPropInput />
    </SmallInputForm>
  )
}
