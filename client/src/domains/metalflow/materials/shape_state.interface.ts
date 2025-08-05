import { Material } from 'domain-model'

export interface IMaterialShapeState {
  export(): unknown
  sync(material: Material): void
  reset(): void
}
