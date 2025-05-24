import { parse } from 'csv'
import fs from 'node:fs'

export class CsvIO {
  static read(csvPath: string): string[][] {
    let result: string[][] = []
    const file = fs.readFileSync(csvPath)

    parse(file, { delimiter: ',' }, async (err, table) => {
      if (err) {
        throw new Error(`Error parsing CSV: ${err}`)
      }
      result = table
    })
    return result
  }
}
