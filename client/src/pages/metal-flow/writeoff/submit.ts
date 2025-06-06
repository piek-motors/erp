import { EnWriteoffType, WriteoffTroughDetail } from 'domain-model'
import { apolloClient } from 'lib/api'
import {
  GetDetailByPkDocument,
  GetDetailByPkQuery,
  InsertMaterialWriteoffDocument,
  InsertMaterialWriteoffMutation,
  InsertMaterialWriteoffMutationVariables,
  Metal_Flow_Writeoffs_Insert_Input
} from 'types/graphql-shema'
import { IWriteOff } from './state'

export const handleSubmit = async (state: IWriteOff) => {
  const { reason, type } = state
  if (reason == null) throw Error('Reason not selected')

  if (type == EnWriteoffType.ThroughDetail) {
    const typeData = state.typeData as WriteoffTroughDetail

    if (!typeData.detailId) {
      throw Error('Detail id not set')
    }

    const detail = await apolloClient.query<GetDetailByPkQuery>({
      query: GetDetailByPkDocument,
      variables: { id: typeData.detailId }
    })

    const d = detail.data.metal_flow_details_by_pk
    if (!d) throw Error('Detail not found')

    // const materialCostInBaseUnit = new Detail(
    //   d.id,
    //   d.name,
    //   d.detail_materials.map(m => {
    //     return new Material(
    //       m.material.id,
    //       m.material.unit,
    //       m.material.shape,
    //       m.material.shape_data
    //     )
    //   }),
    //   d.detail_materials
    // ).calcCost(typeData.qty)

    // return await insert(
    //   materialCostInBaseUnit.map(m => ({
    //     material_id: m.meterial.id,
    //     qty: m.cost,
    //     date: new Date(),
    //     reason,
    //     type: state.type,
    //     type_data: state.typeData
    //   }))
    // )
  } else if (state.type == EnWriteoffType.DirectUnit) {
    if (!state.material) throw Error('Material not selected')

    return await insert([
      {
        material_id: state.material.id,
        qty: state.qty,
        date: new Date(),
        reason,
        type: state.type,
        type_data: state.typeData
      }
    ])
  } else {
    throw Error('Unimplemented writeoff type')
  }
}

function insert(
  data: Metal_Flow_Writeoffs_Insert_Input | Metal_Flow_Writeoffs_Insert_Input[]
) {
  return apolloClient.mutate<
    InsertMaterialWriteoffMutation,
    InsertMaterialWriteoffMutationVariables
  >({
    mutation: InsertMaterialWriteoffDocument,
    variables: {
      objects: data
    }
  })
}
