import z from 'zod'

/**
 * Represents a single processing step
 * - [operaion_id] => only the operation id
 * - [operaion_id, t?] => operation id + optional text
 */
export const WorkflowTask = z.tuple([
  z.number(), // operaion_id
  z
    .string()
    .nullish(), // t (optional / can be null)
])

export const DetailWorkFlowSchema = z.object({
  workflow: z.array(WorkflowTask),
})
