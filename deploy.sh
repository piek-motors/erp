#!/bin/bash
# Choose your target host (you can pass 'namegs' or 'piek' as argument)
TARGET="piek"
# Remote directory to deploy
REMOTE_DIR="/home/prod/erp"  # <-- change this
# PM2 process name
PM2_PROCESS_NAME="erp"  # <-- change this
# Connect and deploy
ssh "$TARGET" <<EOF
  set -e  # exit on any error
  cd "$REMOTE_DIR"
  echo "Pulling latest code..."
  git pull
  pnpm i

  cd ~/erp/shared
  npm run build

  cd ~/erp/server
  npm run build

  if npx pm2 describe "$PM2_PROCESS_NAME" > /dev/null; then
    echo "Process exists. Restarting..."
    npx pm2 restart "$PM2_PROCESS_NAME"
  else
    echo "Process not found. Starting..."
    npx pm2 start ./dist/src/main.js --name "$PM2_PROCESS_NAME"
  fi

EOF