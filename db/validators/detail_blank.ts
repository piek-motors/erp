import { MaterialRequirement } from 'models'
import z from 'zod'

const SingleMaterialRequirement = z.object({
  type: z.literal(MaterialRequirement.Single),
  /** Gross length: Includes all waste (saw kerf/cut width,
   * clamping margins, and end-trimming). */
  gross_length: z.number().nullable(),
  /** Blank length: The actual size of the cut piece
   * before further machining/processing. */
  blank_length: z.number().nullable(),
})

const BatchMaterialRequirement = z.object({
  type: z.literal(MaterialRequirement.Batch),
  /** Full length of the raw stock */
  stock_length: z.number().nullable(),
  /** Number of blanks produced from one stock length */
  yield_per_stock: z.number().nullable(),
})

const CountableMaterialRequirement = z.object({
  type: z.literal(MaterialRequirement.Countable),
  count: z.int().nullable(),
})

const BlankMaterialRequirement = z.object({
  material_id: z.number(),
  data: z.discriminatedUnion('type', [
    SingleMaterialRequirement,
    BatchMaterialRequirement,
    CountableMaterialRequirement,
  ]),
})

const BlankDetailRequirement = z.object({
  detail_id: z.number(),
  qty: z.number(),
})

const BlankAttributes = z.array(
  z.object({
    key: z.string(),
    value: z.any(),
  }),
)

export const BlankSchema = z.object({
  material: BlankMaterialRequirement.optional(),
  details: z.array(BlankDetailRequirement).optional(),
  attributes: BlankAttributes.optional(),
})
