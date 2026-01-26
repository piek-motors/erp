// npx tsx --test ./src/hmm_create_dataset.test.ts
import { db } from '#root/sdk.js'
import { writeFileSync } from 'fs'
import { describe, it } from 'node:test'
import { endOfUTCMonth, startOfUTCMonth } from './lib/time.js'

const TSV_DELIMETER = '\t'

describe('hmm create dataset', () => {
	it('create dataset', async () => {
		const select_considions = {
			name: 'Владислав',
			lastname: 'Начевкин',
			start: startOfUTCMonth(new Date(2025, 10)),
		}
		const end_date = endOfUTCMonth(select_considions.start)
		console.log('start', select_considions.start, 'end_date', end_date)

		const { card } = await db
			.selectFrom('attendance.employees')
			.select('card')
			.where('firstname', 'ilike', `%${select_considions.name}%`)
			.where('lastname', 'ilike', `%${select_considions.lastname}%`)
			.executeTakeFirstOrThrow()

		const events = await db
			.selectFrom('attendance.events')
			.selectAll()
			.where('card', '=', card)
			.where('timestamp', '>', select_considions.start)
			.where('timestamp', '<', end_date)
			.execute()
		if (!events.length) throw Error('No events found, select not so old period')

		console.log(`Selected ${events.length} events`)

		const header = ['timestamp', 'state', 'id']
		const lines: string[] = [header.join(TSV_DELIMETER)]
		let last_date: string = ''
		for (const ev of events) {
			const date = ev.timestamp.toISOString().split('T')[0]
			if (!date) throw Error(`corrupted date for event ${ev.id}`)
			if (last_date && last_date !== date) {
				lines.push(TSV_DELIMETER.repeat(header.length))
			}

			lines.push([ev.timestamp.toUTCString(), 0, ev.id].join(TSV_DELIMETER))
			last_date = date
		}

		const month = select_considions.start.getUTCMonth() + 1
		const year = select_considions.start.getUTCFullYear()
		const path = `../rust/dataset/${card}_${month}-${year}.tsv`
		writeFileSync(path, lines.join('\n'))
		console.log(`dataset saved at ${path}`)
	})
})
