#!/bin/bash
TARGET="piek-office" # SSH target target
REMOTE_DIR="/home/fin/apps/erp" # Remote directory to deploy
PM2_PROCESS_NAME="erp" # PM2 process name
# Connect and deploy
ssh "$TARGET" <<EOF
  set -e  # exit on any error
  cd "$REMOTE_DIR"
  echo "Pulling latest code..."
  git pull

  export PATH="\$HOME/.bun/bin:\$HOME/.local/share/pnpm:\$HOME/.nvm/versions/node/v23.9.0/bin:\$PATH"

  bun install --frozen-lockfile
  bun run build

  cd ~/apps/erp/client
  bun run build:release

  cd ~/apps/erp/db
  bun run migrate

  cd ~/apps/erp/server
  rm -rf ~/apps/erp/server/public
  cp -r ~/apps/erp/client/build ~/apps/erp/server/public
  if npx pm2 describe "$PM2_PROCESS_NAME" > /dev/null; then
    echo "Process exists. Restarting..."
    npx pm2 restart "$PM2_PROCESS_NAME"
  else
    echo "Process not found. Starting..."
    npx pm2 start bun --name "erp" -- run "start"
  fi
  echo "Deployment complete. Showing logs (Ctrl+C to exit)..."
  npx pm2 logs "$PM2_PROCESS_NAME"
EOF