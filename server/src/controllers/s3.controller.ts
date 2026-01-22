import type { NextFunction, Request, Response } from 'express'
import { config } from '#root/config/env.js'
import { attachmentService } from '#root/ioc/index.js'
import { logger } from '#root/ioc/log.js'
import { s3 } from '#root/ioc/s3.js'

export const uploadBinaryFiles = async (
	req: Request & { files: any[]; headers: { order_id: string } },
	res: Response,
	next: NextFunction,
) => {
	/**
	 * Incoming request must contain a 'orderid'(integer) parameter in request headers.
	 * The `Request` object will be populated with a `files` object containing
	 * information about the processed file.
	 */
	const detailId = req.headers.detailid as string
	const orderId = req.headers.orderid as string
	try {
		const files = req.files.map(file => ({
			key: file.key,
			originalname: file.originalname,
			size: file.size,
		}))

		const orderIdNum = orderId ? parseInt(orderId, 10) : undefined
		const detailIdNum = detailId ? parseInt(detailId, 10) : undefined
		const data = await attachmentService.uploadAndLinkFiles(
			files,
			orderIdNum,
			detailIdNum,
		)
		res.send(data)
	} catch (error) {
		logger.error(error, 'Error uploading binary files')
		next(error)
	}
}

export const getBinaryFile = async (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const key = req.params.key
	try {
		const data = await s3
			.getObject({
				Bucket: config.S3_BUCKET,
				Key: key,
			})
			.promise()
		const fileName = encodeURI(data.Metadata?.originalname ?? '')
		res.set('Content-Type', data.ContentType)
		res.set('Content-Disposition', `inline;filename*=utf-8''${fileName}`)
		res.send(data.Body)
	} catch (error) {
		logger.error(error, `Error getting binary file with key ${key}`)
		next(error)
	}
}
