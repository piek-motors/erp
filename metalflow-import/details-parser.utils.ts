import { Detail, Material } from 'domain-model'
import { MaterialParser } from './material-parser'

// Types
type MaterialDetails = Map<Material, Array<Detail>>
type CsvLine = string[]

// Helper Functions
export function createDetail(
  id: number,
  detailName: string,
  material: Material,
  weight: number,
  length: number
): Detail {
  const materialMap = new Map<Material, { weight: number; length: number }>()
  materialMap.set(material, {
    weight: Number(weight),
    length: Number(length)
  })
  return new Detail(id, detailName, materialMap)
}

export function filterMaterialsOnlyWithDetails(
  details: MaterialDetails
): MaterialDetails {
  return new Map(
    Array.from(details.entries()).filter(([_, value]) => value.length > 0)
  )
}

export function processCsvLine(
  line: CsvLine,
  materialDetails: MaterialDetails,
  currentMaterial: Material | undefined,
  detailId: number
): {
  materialDetails: MaterialDetails
  currentMaterial: Material | undefined
  detailId: number
} {
  const id = line[0]
  if (id) {
    const name = line[1]
    if (name) {
      const material = MaterialParser.parse(name)
      if (material) {
        materialDetails.set(material, [])

        try {
          // check if material is valid
          material.deriveLabel()
        } catch (e) {
          console.error(`\n\nfailed to parse material ${name}\n\n`, material)
          throw new Error(`failed to parse material ${name}`)
        }
        return { materialDetails, currentMaterial: material, detailId }
      }
    }
    return { materialDetails, currentMaterial, detailId }
  }

  if (!currentMaterial) {
    console.log('Material is not set for detail', line)
    return { materialDetails, currentMaterial, detailId }
  }

  const detailName = line[1]
  const length = line[3]
  const weight = line[4]
  const details = materialDetails.get(currentMaterial) || []

  const detail = createDetail(
    detailId,
    detailName,
    currentMaterial,
    Number(weight),
    Number(length)
  )

  details.push(detail)
  materialDetails.set(currentMaterial, details)
  return { materialDetails, currentMaterial, detailId: detailId + 1 }
}
