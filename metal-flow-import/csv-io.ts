import { parse } from 'csv'
import fs from 'node:fs'

export class CsvIO {
  static read(csvPath: string): Promise<string[][]> {
    const file = fs.readFileSync(csvPath)
    return new Promise((resolve, reject) => {
      parse(file, { delimiter: ',' }, async (err, table) => {
        if (err) {
          throw new Error(`Error parsing CSV: ${err}`)
        }
        resolve(table)
      })
    })
  }
}
