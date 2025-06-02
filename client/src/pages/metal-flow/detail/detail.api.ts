import { apolloClient } from 'api'
import * as gql from 'types/graphql-shema'
import { map } from '../mappers'

export async function insertDetail(
  variables: gql.InsertDetailMutationVariables
): Promise<number> {
  return await apolloClient
    .mutate<gql.InsertDetailMutation, gql.InsertDetailMutationVariables>({
      mutation: gql.InsertDetailDocument,
      variables
    })
    .then(res => {
      if (res.data?.insert_metal_flow_details_one?.id) {
        return res.data.insert_metal_flow_details_one.id
      }
      throw new Error('Failed to insert detail')
    })
}

export async function getDetail(id: number) {
  return await apolloClient
    .query<gql.GetDetailByPkQuery, gql.GetDetailByPkQueryVariables>({
      query: gql.GetDetailByPkDocument,
      variables: { id }
    })
    .then(res => {
      return map.detail.fromDto(res.data.metal_flow_details_by_pk)
    })
}

export async function getDetails() {
  return await apolloClient
    .query<gql.GetDetailsQuery, gql.GetDetailsQueryVariables>({
      query: gql.GetDetailsDocument
    })
    .then(res => {
      if (!res.data.metal_flow_details) return []

      return res.data.metal_flow_details.map(d => {
        const mapped = map.detail.fromDto(d)
        if (!mapped) {
          throw new Error('Failed to map detail')
        }

        return mapped
      })
    })
}

export async function updateDetail(
  variables: gql.UpdateDetailMutationVariables
) {
  return await apolloClient
    .mutate<gql.UpdateDetailMutation, gql.UpdateDetailMutationVariables>({
      mutation: gql.UpdateDetailDocument,
      variables
    })
    .then(res => {
      if (res.data?.update_metal_flow_details_by_pk?.id) {
        return res.data.update_metal_flow_details_by_pk.id
      }
      throw new Error('Failed to update detail')
    })
}

export async function updateDetailMaterialRelationData(
  variables: gql.UpdateDetailMaterialRelationDataMutationVariables
) {
  return await apolloClient
    .mutate<
      gql.UpdateDetailMaterialRelationDataMutation,
      gql.UpdateDetailMaterialRelationDataMutationVariables
    >({
      mutation: gql.UpdateDetailMaterialRelationDataDocument,
      variables
    })
    .then(res => {
      if (res.errors) {
        throw new Error(res.errors.join('\n'))
      }
    })
}

export async function deleteDetail(id: number) {
  return await apolloClient
    .mutate<gql.DeleteDetailMutation, gql.DeleteDetailMutationVariables>({
      mutation: gql.DeleteDetailDocument,
      variables: { id }
    })
    .then(res => {
      if (res.data?.delete_metal_flow_details_by_pk?.id) {
        return res.data.delete_metal_flow_details_by_pk.id
      }
      throw new Error('Failed to delete detail')
    })
}
