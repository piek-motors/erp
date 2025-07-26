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

export const detailBaseSchema = z.object({
  name: z.string().min(5, 'Название должно быть не менее 5 символов'),
  description: z.string().nullable(),
  partCode: z.string().nullable(),
  groupId: z.number().nullable(),
  params: z.record(z.any()).nullable(),
  materialRelations: z.array(materialRelationSchema)
})

export const detailDto = detailBaseSchema

export const updateDetailDto = detailBaseSchema.extend({
  id: z.number()
})
