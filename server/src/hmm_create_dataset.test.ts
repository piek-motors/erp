import { db } from '#root/sdk.js'
import { writeFileSync } from 'fs'
import { describe, it } from 'node:test'

// npx tsx --test ./src/hmm_create_dataset.test.ts
describe('hmm create dataset', () => {
	it('create dataset', async () => {
		const select_considions = {
			name: 'Сергей',
			lastname: 'Игнатьев',
			start_date: '2025-12-01T00:00:00.000Z',
			end_date: '2025-12-30T23:59:59.000Z',
		}

		const card = await db
			.selectFrom('attendance.employees')
			.select('card')
			.where('firstname', 'ilike', `%${select_considions.name}%`)
			.where('lastname', 'ilike', `%${select_considions.lastname}%`)
			.execute()
		if (!card.length)
			throw Error('Cannot find employee card with given name and lastname')
		if (card.length > 1)
			throw Error('Found more the one user with a given selection params')

		const events = await db
			.selectFrom('attendance.events')
			.selectAll()
			.where('card', '=', card[0].card)
			.where('timestamp', '>', new Date(select_considions.start_date))
			.where('timestamp', '<', new Date(select_considions.end_date))
			.execute()

		console.log(`Selected ${events.length} events`)

		const lines: string[] = ['timestamp, state, id, card']
		let last_date: string = ''
		for (const ev of events) {
			const date = ev.timestamp.toISOString().split('T')[0]
			if (!date) throw Error(`corrupted date for event ${ev.id}`)
			if (last_date && last_date !== date) {
				lines.push('')
			}

			lines.push([ev.timestamp.toUTCString(), 0, ev.id, ev.card].join(', '))
			last_date = date
		}

		writeFileSync('../rust/events_seed.csv', lines.join('\n'))
	})
})
