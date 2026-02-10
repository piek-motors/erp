import { it } from 'node:test'
import { get_details_by_operation_id } from './details_rpc.js'

it('get details by operation id', async () => {
  const operaion_id = 46
  const details = await get_details_by_operation_id(operaion_id)

  console.log(`Opetaions ${46}`, details)
})
