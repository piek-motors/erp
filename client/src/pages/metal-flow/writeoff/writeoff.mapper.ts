import { Writeoff } from 'domain-model'
import {
  GetWrietOffsQuery,
  InsertMaterialWriteoffMutationVariables
} from 'types/graphql-shema'
import { map } from '../mappers'

export class WriteoffMapper {
  toDomain(
    writeoff: GetWrietOffsQuery['metal_flow_writeoffs'][number]
  ): Writeoff {
    return new Writeoff(
      writeoff.id,
      new Date(writeoff.date),
      writeoff.qty,
      writeoff.reason,
      map.material.fromDto(writeoff.material),
      writeoff.type,
      writeoff.type_data
    )
  }

  insert(
    writeoff: Writeoff
  ): InsertMaterialWriteoffMutationVariables['objects'] {
    return {
      date: writeoff.date,
      qty: writeoff.qty,
      reason: writeoff.reason,
      material_id: writeoff.material.id,
      type: writeoff.type,
      type_data: writeoff.typeData
    }
  }
}
