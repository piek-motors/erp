import { Writeoff } from 'domain-model'
import { apolloClient } from 'lib/api'
import {
  GetWrietOffsDocument,
  GetWrietOffsQuery,
  GetWrietOffsQueryVariables,
  InsertMaterialWriteoffDocument,
  InsertMaterialWriteoffMutation,
  InsertMaterialWriteoffMutationVariables
} from 'types/graphql-shema'
import { WriteoffMapper } from './writeoff.mapper'

export class WriteoffApi {
  private mapper = new WriteoffMapper()

  async list(): Promise<Writeoff[]> {
    const res = await apolloClient.query<
      GetWrietOffsQuery,
      GetWrietOffsQueryVariables
    >({
      query: GetWrietOffsDocument,
      fetchPolicy: 'network-only'
    })
    return res.data.metal_flow_writeoffs.map(each => {
      return this.mapper.toDomain(each)
    })
  }

  async create(writeoff: Writeoff): Promise<number> {
    const res = await apolloClient.mutate<
      InsertMaterialWriteoffMutation,
      InsertMaterialWriteoffMutationVariables
    >({
      mutation: InsertMaterialWriteoffDocument,
      variables: {
        objects: this.mapper.insert(writeoff)
      }
    })
    if (!res.data?.insert_metal_flow_writeoffs?.returning[0].id) {
      throw new Error('Writeoff not created')
    }
    return res.data.insert_metal_flow_writeoffs.returning[0].id
  }

  async createMany(writeoffs: Writeoff[]): Promise<number[]> {
    return await Promise.all(writeoffs.map(w => this.create(w)))
  }
}
