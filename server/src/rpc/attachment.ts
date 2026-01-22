import { attachmentService } from '#root/ioc/index.js'
import { router } from '#root/lib/trpc/trpc.js'
import { config, db, procedure, s3, TRPCError } from '#root/sdk.js'
import { z } from 'zod'

export const delete_file = procedure
	.input(
		z.object({
			key: z.string(),
			type: z.enum(['order', 'detail']),
		}),
	)
	.mutation(async ({ input }) => {
		const { id } = await db
			.deleteFrom('attachments')
			.where('key', '=', input.key)
			.returning('id')
			.executeTakeFirstOrThrow()

		await s3
			.deleteObject({ Bucket: config.S3_BUCKET, Key: input.key })
			.promise()
			.catch(err => {
				throw new Error(`Could not delete file from S3: ${err.message}`)
			})

		switch (input.type) {
			case 'order':
				await db
					.deleteFrom('orders.order_attachments')
					.where('attachment_id', '=', id)
					.execute()
				break
			case 'detail':
				await db
					.deleteFrom('pdo.detail_attachments')
					.where('attachment_id', '=', id)
					.execute()
				break
			default:
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Invalid type',
				})
		}

		return 'ok'
	})

export const attachments = router({
	update_name: procedure
		.input(
			z.object({
				key: z.string(),
				name: z.string(),
			}),
		)
		.mutation(async ({ input }) => {
			const attachment = await db
				.updateTable('attachments')
				.set({ filename: input.name })
				.where('key', '=', input.key)
				.executeTakeFirst()
			if (!attachment) {
				throw new TRPCError({
					code: 'BAD_REQUEST',
					message: 'Attachment not found',
				})
			}
			return 'ok'
		}),
	//
	delete_file,
	//
	get_detail_attachments: procedure
		.input(
			z.object({
				detailId: z.number(),
			}),
		)
		.query(async ({ input }) => {
			return await attachmentService.getDetailAttachments(input.detailId)
		}),
	//
	get_attachment_by_key: procedure
		.input(
			z.object({
				key: z.string(),
			}),
		)
		.query(async ({ input }) => {
			return await attachmentService.get(input.key)
		}),
})
