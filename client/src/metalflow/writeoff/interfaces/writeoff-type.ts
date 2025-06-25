import { EnWriteoffReason, WriteoffTypeDataUnion } from 'domain-model'

export interface IWriteoffMethod {
  getTypeData(): WriteoffTypeDataUnion
  validate(): Error | undefined
  save(reason: EnWriteoffReason): Promise<number[]>
}
