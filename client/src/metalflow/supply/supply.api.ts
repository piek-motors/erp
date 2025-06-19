import { apolloClient } from 'lib/api'
import {
  DeleteSupplyDocument,
  DeleteSupplyMutation,
  DeleteSupplyMutationVariables,
  GetSuppliesDocument,
  GetSuppliesQuery,
  InsertMaterialSupplyDocument,
  InsertMaterialSupplyMutation,
  InsertMaterialSupplyMutationVariables
} from 'lib/types/graphql-shema'

export async function insertSupply(
  variables: InsertMaterialSupplyMutationVariables
) {
  const res = await apolloClient.mutate<
    InsertMaterialSupplyMutation,
    InsertMaterialSupplyMutationVariables
  >({
    mutation: InsertMaterialSupplyDocument,
    variables
  })
  const id = res.data?.insert_metal_flow_supplies_one?.id
  if (res.errors) {
    throw new Error(res.errors.map(e => e.message).join('\n'))
  }
  if (!id) {
    throw new Error('Failed to insert supply')
  }
  return id
}

export async function deleteSupply(id: number) {
  const res = await apolloClient.mutate<
    DeleteSupplyMutation,
    DeleteSupplyMutationVariables
  >({
    mutation: DeleteSupplyDocument,
    variables: {
      id
    }
  })
  if (res.errors) {
    throw new Error(res.errors.map(e => e.message).join('\n'))
  }
  return res.data?.delete_metal_flow_supplies_by_pk?.id
}

export async function getSupplies() {
  const res = await apolloClient.query<GetSuppliesQuery>({
    query: GetSuppliesDocument,
    fetchPolicy: 'network-only'
  })
  if (res.errors) {
    throw new Error(res.errors.map(e => e.message).join('\n'))
  }
  return res.data?.metal_flow_supplies
}
