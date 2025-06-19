import { Detail, Material } from 'domain-model'
import { apolloClient } from 'lib/api'
import * as gql from 'lib/types/graphql-shema'
import { map } from '../../mappers'

export async function updateMaterial(
  variables: gql.UpdateMaterialMutationVariables
) {
  return await apolloClient
    .mutate<gql.UpdateMaterialMutation, gql.UpdateMaterialMutationVariables>({
      mutation: gql.UpdateMaterialDocument,
      variables
    })
    .then(res => {
      const id = res.data?.update_metal_flow_materials_by_pk?.id
      if (id) return id
      if (res.errors) throw new Error(JSON.stringify(res.errors))
      throw new Error('Failed to update material')
    })
}

export async function insertMaterial(
  variables: gql.InsertMaterialMutationVariables
) {
  return await apolloClient
    .mutate<gql.InsertMaterialMutation, gql.InsertMaterialMutationVariables>({
      mutation: gql.InsertMaterialDocument,
      variables
    })
    .then(res => {
      if (res.data?.insert_metal_flow_materials_one?.id) {
        return res.data.insert_metal_flow_materials_one.id
      }
      throw new Error('Failed to insert material')
    })
}

export async function getMaterial(id: number) {
  return await apolloClient
    .query<gql.GetMaterialByPkQuery, gql.GetMaterialByPkQueryVariables>({
      query: gql.GetMaterialByPkDocument,
      variables: { id },
      fetchPolicy: 'network-only'
    })
    .then(res => {
      if (res.data?.metal_flow_materials_by_pk) {
        return map.material.fromDto(res.data.metal_flow_materials_by_pk)
      }

      throw new Error('Material not found')
    })
}

export async function getMaterials() {
  return await apolloClient
    .query<gql.GetMaterialsQuery, gql.GetMaterialsQueryVariables>({
      query: gql.GetMaterialsDocument,
      fetchPolicy: 'cache-first'
    })
    .then(res => {
      return res.data?.metal_flow_materials
        .map(map.material.fromDto)
        .sort((a, b) => a.id - b.id)
    })
}

export async function getDetailsMadeOfMaterial(
  material: Material
): Promise<Detail[]> {
  return await apolloClient
    .query<
      gql.GetDetailsMadeOfMaterialQuery,
      gql.GetDetailsMadeOfMaterialQueryVariables
    >({
      query: gql.GetDetailsMadeOfMaterialDocument,
      variables: { material_id: material.id },
      fetchPolicy: 'cache-first'
    })
    .then(res => {
      return res.data?.metal_flow_details
        .flatMap(each =>
          each.detail_materials.map(each => {
            const detail = new Detail({
              id: each.detail.id,
              name: each.detail.name,
              partCode: each.detail.part_code ?? null
            })
            detail.madeOf(material, each.data?.length, each.data?.weight)
            return detail
          })
        )
        .filter(Boolean) as Detail[]
    })
}
