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
      saveDetailsAndRelations: async () => {}
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

    const details = new Set<string>()
    for (const scope of analysisContext.materialScopes) {
      for (const detail of scope.details) {
        details.add(detail.name)
      }
    }

    const dataDetails = Array.from(details).sort((a, b) => a.localeCompare(b))
    await fs.writeFile('./out/details.txt', dataDetails.join('\n'))
  })
})
