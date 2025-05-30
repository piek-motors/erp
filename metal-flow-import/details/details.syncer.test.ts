import { before, beforeEach, describe, it } from 'node:test'
import { DetailSyncer } from './details.syncer'

describe('DetailsSyncer', () => {
  let instance: DetailSyncer

  before(async () => {
    const fs = await import('node:fs/promises')
    await fs.mkdir('./out', { recursive: true })
  })

  beforeEach(() => {
    instance = new DetailSyncer({
      getAllMaterials: async () => [],
      insertMaterials: async () => {},
      saveDetailsAndRelations: async () => {},
      loadMaterials: async () => {}
    })
  })

  it('should parse details', async () => {
    const analysisContext = await instance.parseTable()
    const materialLabels = new Set<string>()
    const materials = analysisContext.getMaterials()
    for (const material of materials) {
      materialLabels.add(material.deriveLabel())
    }

    const fs = await import('node:fs/promises')
    const data = Array.from(materialLabels).sort((a, b) => a.localeCompare(b))
    await fs.writeFile('./out/material-labels.txt', data.join('\n'))

    // Collect unique detail names
    const uniqueDetails = new Map<string, Set<string>>()
    for (const scope of analysisContext.materialScopes) {
      for (const detail of scope.details) {
        if (!uniqueDetails.has(detail.name)) {
          uniqueDetails.set(detail.name, new Set())
        }
        // Add material label to the set of materials for this detail
        uniqueDetails.get(detail.name)?.add(scope.material.deriveLabel())
      }
    }

    // Convert to array and sort
    const dataDetails = Array.from(uniqueDetails.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(
        ([name, materials]) =>
          `${name} (${Array.from(materials).sort().join(', ')})`
      )

    await fs.writeFile('./out/details.txt', dataDetails.join('\n'))
  })
})
