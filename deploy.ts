const { exec } = require('child_process')
const util = require('util')
const path = require('path')
const os = require('os')

const execAsync = util.promisify(exec)

const remoteCommands = `
  ssh piek "cd ~/erp && git pull origin main"
`

async function runCommand(command: string) {
  try {
    const { stdout, stderr } = await execAsync(command)
    if (stdout) console.log(stdout)
    if (stderr) console.error(stderr)
    return true
  } catch (error) {
    console.error(`Error executing command: ${command}`)
    throw error
  }
}

runCommand(remoteCommands)
