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
  npm --prefix server run build
  echo "Restarting PM2 process..."
  npx pm2 restart "$PM2_PROCESS_NAME"
EOF