import { Command } from 'commander'
import { execSync } from 'node:child_process'

const program = new Command()
  .name('run-one-testcase')
  .description('Run a single test')
  .requiredOption('-f, --file <file>', 'test file')
  .option('-t, --test <test>', 'test name')
  .option('-c, --clear', 'clear the priveous terminal output')
  .parse(process.argv)

const { test: testcase, file, clear } = program.opts()
if (!file) {
  throw Error('Missing test name or file')
}

if (clear) {
  console.clear()
}

const build = 'tsc -p .'
execSync(build, { stdio: 'inherit' })

const testf = testcase ? `--test-name-pattern="${testcase}"` : ''
const cmd = `node --experimental-transform-types --test ${testf} ${file}`
console.log(`\nRunning tests for: ${file} ${testcase} \n`)
execSync(cmd, { stdio: 'inherit' })
