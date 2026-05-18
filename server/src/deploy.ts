import { spawn } from 'node:child_process'

// 1. Define Deployment Configuration
const CONFIG = {
  TARGET: 'piek',
  REMOTE_DIR: '/home/fin/apps/erp',
  PM2_PROCESS_NAME: 'erp',
  NODE_VERSION: 'v23.9.0',
} as const

// 2. Construct the Remote Execution Script
// Using template literals allows us to inject our TS config into the bash sequence safely.
const remoteScript = `
  set -e # Exit immediately if a command exits with a non-zero status

  # Setup Environment Paths
  export PATH="$HOME/.local/share/pnpm:$HOME/.nvm/versions/node/${CONFIG.NODE_VERSION}/bin:$PATH"

  # Ensure pnpm is installed
  if ! command -v pnpm &> /dev/null; then
    echo "📦 pnpm not found, installing..."
    curl -fsSL https://get.pnpm.io/install.sh | sh -
  fi

  cd "${CONFIG.REMOTE_DIR}"

  echo "🔄 Pulling latest code..."
  git pull

  echo "📥 Installing server dependencies..."
  pnpm install --frozen-lockfile

  echo "🏗️  Building..."
  pnpm run check
  pnpm run build

  echo "📂 Updating server public directory..."
  cd "${CONFIG.REMOTE_DIR}/server"

  echo "🗄️  Running migrations..."
  pnpm run migration:run

  rm -rf public
  cp -r ../client/build public

  cd "${CONFIG.REMOTE_DIR}"
  
  echo "🚀 Starting/restarting PM2 process..."
  if npx pm2 describe "${CONFIG.PM2_PROCESS_NAME}" > /dev/null 2>&1; then
    echo "Process exists. Restarting..."
    npx pm2 restart "${CONFIG.PM2_PROCESS_NAME}"
  else
    echo "Process not found. Starting with Node via pnpm..."
    npx pm2 start pnpm --name "${CONFIG.PM2_PROCESS_NAME}" -- run start
  fi

  echo "✅ Deployment complete. Tailing logs (Ctrl+C to exit logs)..."
  npx pm2 logs "${CONFIG.PM2_PROCESS_NAME}"
`

// 3. Execute the script over SSH
console.log(`🔌 Connecting to ${CONFIG.TARGET}...`)

const sshProcess = spawn('ssh', [CONFIG.TARGET], {
  // Pipe stdin from our script, inherit stdout and stderr directly to the terminal
  stdio: ['pipe', process.stdout, process.stderr],
})

// Write the script to the SSH process and close the input stream
if (sshProcess.stdin) {
  sshProcess.stdin.write(remoteScript)
  sshProcess.stdin.end()
}

// 4. Handle Exit Codes
sshProcess.on('close', code => {
  if (code === 0) {
    console.log('\n🎉 Deployment finished successfully.')
  } else {
    console.error(`\n❌ Deployment failed with exit code ${code}`)
    process.exit(1)
  }
})

// Handle local process errors (e.g., SSH binary not found)
sshProcess.on('error', err => {
  console.error('\n🚨 Failed to start SSH process:', err.message)
  process.exit(1)
})
