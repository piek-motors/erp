import { TRPCError } from '@trpc/server'
import { z } from 'zod'

export const isDetailPertCodeUniqueError = (e: Error) => {
  return e.message.includes(
    `duplicate key value violates unique constraint "details_part_code_key"`
  )
}

export const ErrDetailPartCodeUnique = new TRPCError({
  code: 'CONFLICT',
  message: 'Деталь с таким конструкторским кодом уже существует'
})

// Shared validation schemas
export const materialRelationSchema = z.object({
  materialId: z.number(),
  length: z.string()
})

export const processingRouteSchema = z.object({
  steps: z.array(
    z.object({
      name: z.string(),
      dur: z.number()
    })
  )
})

export const technicalParametersSchema = z.object({
  arr: z.array(
    z.object({
      key: z.string(),
      value: z.any()
    })
  )
})

export const automaticWriteoffSchema = z.object({
  details: z.array(
    z.object({
      detail_id: z.number(),
      qty: z.number()
    })
  ),
  materials: z.array(
    z.object({
      material_id: z.number(),
      length: z.number()
    })
  )
})

export const detailBaseSchema = z.object({
  name: z.string().min(5, 'Название должно быть не менее 5 символов'),
  description: z.string().nullable(),
  partCode: z.string().nullable(),
  groupId: z.number().nullable(),
  technicalParams: technicalParametersSchema.nullable(),
  processingRoute: processingRouteSchema.nullable(),
  drawingName: z.string().nullable(),
  automaticWriteoff: automaticWriteoffSchema.nullable()
})

export const detailDto = detailBaseSchema

export const updateDetailDto = detailBaseSchema.extend({
  id: z.number()
})
