import { it } from 'node:test'
import { db } from '#root/sdk.js'
import { DetailRepo } from './storage/detail_repo.js'

const repo = new DetailRepo(db)

it('get details by operation id', async () => {
  const operaion_id = 46
  const details = await repo.filter_by_operation_id(operaion_id)

  console.log(`Opetaions ${46}`, details)
})
