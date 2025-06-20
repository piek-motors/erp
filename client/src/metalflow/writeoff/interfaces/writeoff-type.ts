import { WriteoffTypeDataUnion } from 'domain-model'

export interface IWriteoffType {
  getTypeData(): WriteoffTypeDataUnion
  validate(): Error | undefined
}
