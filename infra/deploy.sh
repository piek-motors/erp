#!/bin/bash
TARGET="piek-office" # SSH target host 
REMOTE_DIR="/home/fin/apps/erp" # Remote directory to deploy
PM2_PROCESS_NAME="erp" # PM2 process name
# Connect and deploy
ssh "$TARGET" <<EOF
  set -e  # exit on any error
  cd "$REMOTE_DIR"
  echo "Pulling latest code..."
  git pull
  pnpm i --frozen-lockfile
  pnpm build

  cd ~/erp/client
  pnpm build:release

  cd ~/erp/db
  pnpm migrate

  cd ~/erp/server
  if npx pm2 describe "$PM2_PROCESS_NAME" > /dev/null; then
    echo "Process exists. Restarting..."
    npx pm2 restart "$PM2_PROCESS_NAME"
  else
    echo "Process not found. Starting..."
    npx pm2 start npm --name "erp" -- run "start"
  fi

EOF