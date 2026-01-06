#!/usr/bin/env ts-node
import * as fs from 'fs'
import * as path from 'path'

const timestamp = new Date()
  .toISOString()
  .replace(/[-:]/g, '')
  .split('.')[0]
  .replace('T', '')
const migrationName = process.argv[2]

if (!migrationName) {
  console.error('Expects argument [name] at first position')
  process.exit(1)
}

const formattedName = migrationName
  .toLowerCase()
  .replace(/[^a-z0-9]/g, '_')
  .replace(/_+/g, '_')

const fileName = `${timestamp}_${formattedName}.ts`
const migrationsDir = './migrations'

// Create migrations directory if it doesn't exist
if (!fs.existsSync(migrationsDir)) {
  fs.mkdirSync(migrationsDir, { recursive: true })
}

const filePath = path.join(migrationsDir, fileName)

const template = `import { type KDB } from '../schema'
export async function up(db: KDB): Promise<void> {
}

export async function down(db: KDB): Promise<void> {
}
`

fs.writeFileSync(filePath, template)
console.log(`Created migration file: ${fileName}`)
