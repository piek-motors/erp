import { parse } from 'csv'
import fs from 'node:fs'


interface ReadOpts {
  stripHeading?: boolean
}

export class CsvIO {
  static read(csvPath: string, opts: ReadOpts = {}): Promise<string[][]> {
    const file = fs.readFileSync(csvPath)
    return new Promise((resolve, reject) => {
      parse(file, { delimiter: ',' }, async (err, table: string[][]) => {
        if (err) {
          throw new Error(`Error parsing CSV: ${err}`)
        }

        if (opts.stripHeading) {
          table.shift()
        }
        resolve(table)
      })
    })
  }
}
