import { Material } from 'models'

export interface IMaterialShapeState {
  export(): unknown
  sync(material: Material): void
  reset(): void
}
