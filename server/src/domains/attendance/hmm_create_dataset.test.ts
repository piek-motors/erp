// npx tsx --test ./src/domains/attendance/hmm_create_dataset.test.ts

import { describe, it } from 'node:test'
import { writeFileSync } from 'fs'
import { db } from '#root/sdk.js'
import { endOfUTCMonth, startOfUTCMonth } from '../../lib/time.js'

const DELIMETER = '\t'

const SELECT = {
  name: 'Евгений',
  lastname: 'Иванов',
  start: startOfUTCMonth(new Date(2026, 1 - 1)),
}

describe('hmm create dataset', () => {
  it('create dataset', async () => {
    const end_date = endOfUTCMonth(SELECT.start)
    console.log('start', SELECT.start, 'end_date', end_date)

    const empl = await db
      .selectFrom('attendance.employees')
      .selectAll()
      .where('firstname', 'ilike', `%${SELECT.name}%`)
      .where('lastname', 'ilike', `%${SELECT.lastname}%`)
      .executeTakeFirstOrThrow()

    console.log('employee', empl)
    const { card } = empl

    const events = await db
      .selectFrom('attendance.events')
      .selectAll()
      .where('card', '=', card)
      .where('timestamp', '>', SELECT.start)
      .where('timestamp', '<', end_date)
      .execute()
    if (!events.length) throw Error('No events found, select not so old period')

    console.log(`Selected ${events.length} events`)

    const header = ['timestamp', 'state', 'id']
    const employee_ident = [empl.firstname, empl.lastname]

    const lines: string[] = [
      employee_ident.join(DELIMETER),
      header.join(DELIMETER),
      '',
    ]
    let last_date: string = ''

    for (const ev of events) {
      const date = ev.timestamp.toISOString().split('T')[0]
      if (!date) throw Error(`corrupted date for event ${ev.id}`)

      if (last_date && last_date !== date) {
        lines.push(DELIMETER.repeat(header.length))
      }

      lines.push([ev.timestamp.toUTCString(), 0, ev.id].join(DELIMETER))
      last_date = date
    }

    const month = SELECT.start.getUTCMonth() + 1
    const year = SELECT.start.getUTCFullYear()
    const path = `../rust/dataset/${month}-${year}_${card}.tsv`

    writeFileSync(path, lines.join('\n'))
    console.log(`dataset saved at ${path}`)
  })
})
