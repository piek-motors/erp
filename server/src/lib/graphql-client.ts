import { type DocumentNode, print as stringifyGraphqlNode } from 'graphql'
import fetch from 'node-fetch'
import { getSdk, type Requester } from '../../generated/schema-typedefs.ts'
import { config } from '../config.ts'
import ApiError from '../exceptions/api.error.ts'

type GraphQLErrorResult = {
  errors: {
    extensions: {
      path: string
      code: string
    }
    message: string
  }[]
}

type GrapqhQLDataResult<RData> = {
  data: RData
}

const resolver: Requester = async <RData, Vars>(
  doc: DocumentNode,
  vars?: Vars
): Promise<RData> => {
  return fetch(config.HASURA_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-hasura-admin-secret': config.HASURA_ADMIN_SECRET
    },
    body: JSON.stringify({ query: stringifyGraphqlNode(doc), variables: vars })
  })
    .then(
      res =>
        res.json() as unknown as GrapqhQLDataResult<RData> & GraphQLErrorResult
    )
    .then(json => {
      if (json.errors) {
        console.error(JSON.stringify(json.errors))
        throw ApiError.HasuraServiceError(
          'hasura-service-error',
          JSON.stringify(json.errors)
        )
      }
      return json.data
    })
}

export const database = getSdk(resolver)
