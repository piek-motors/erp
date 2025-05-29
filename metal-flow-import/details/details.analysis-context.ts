import { Detail, Material } from 'domain-model'

export class MaterialScope {
  readonly details = new Array<Detail>()
  constructor(readonly material: Material) {}
  addDetail(detail: Detail) {
    this.details.push(detail)
  }
}

export class AnalysisContext {
  currentScope: MaterialScope | undefined
  readonly materialScopes = new Array<MaterialScope>()

  openNewScope(material: Material) {
    if (this.currentScope) {
      this.materialScopes.push(this.currentScope)
    }

    const scope = new MaterialScope(material)
    this.currentScope = scope
    return scope
  }

  addDetailToCurrentScope(detail: Detail) {
    if (!this.currentScope) {
      throw new ErrCurrentScopeNotDefined()
    }

    this.currentScope.addDetail(detail)
  }

  getCurrentMaterial(): Material {
    if (!this.currentScope) {
      throw new ErrCurrentScopeNotDefined()
    }

    return this.currentScope.material
  }

  countDetails() {
    return this.materialScopes.reduce(
      (acc, scope) => acc + scope.details.length,
      0
    )
  }

  countMaterials() {
    return this.materialScopes.length
  }

  getMaterials() {
    return this.materialScopes.map(scope => scope.material)
  }
}

class ErrCurrentScopeNotDefined extends Error {}
