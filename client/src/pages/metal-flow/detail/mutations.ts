import { apolloClient } from 'src/api'
import * as gql from 'src/types/graphql-shema'
import { IDetail } from './state'
import { Detail, Material } from 'shared/domain'

export const handleUpdateDetail = async (state: IDetail) => {
  await apolloClient.mutate<
    gql.UpdateDetailMutation,
    gql.UpdateDetailMutationVariables
  >({
    mutation: gql.UpdateDetailDocument,
    variables: {
      id: state.detailID,
      _set: {
        name: state.name
      }
    }
  })

  for (const [material, relationData] of state.materials.entries()) {
    await apolloClient.mutate<
      gql.UpdateDetailMaterialRelationDataMutation,
      gql.UpdateDetailMaterialRelationDataMutationVariables
    >({
      mutation: gql.UpdateDetailMaterialRelationDataDocument,
      variables: {
        data: relationData,
        detail_id: state.detailID,
        material_id: material.id
      }
    })
  }
  state.setRecentlyUpdated(mapDetailsFromState(state))
}

export const handleInsertDetail = async (state: IDetail) => {
  const payload: gql.Metal_Pdo_Detail_Materials_Insert_Input[] = []
  for (const [material, relationData] of state.materials.entries()) {
    payload.push({
      material_id: material.id,
      data: relationData
    })
  }
  const res = await apolloClient.mutate<
    gql.InsertDetailMutation,
    gql.InsertDetailMutationVariables
  >({
    mutation: gql.InsertDetailDocument,
    variables: {
      object: {
        name: state.name,
        detail_materials: {
          data: payload
        }
      }
    }
  })
  state.setRecentlyAdded(mapDetailsFromState(state))
  if (res.errors?.length) {
    throw Error(res.errors.join('\n'))
  }
  return res.data?.insert_metal_pdo_details_one?.id
}

function mapDetailsFromState(state: IDetail) {
  const materials = new Map<Material, { weight: number; length: number }>()
  for (const [material, relationData] of state.materials.entries()) {
    materials.set(material, {
      weight: Number(relationData?.weight || 0),
      length: Number(relationData?.length || 0)
    })
  }
  return new Detail(state.detailID, state.name, materials)
}
