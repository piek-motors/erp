#!/bin/bash

TARGET="piek"               # SSH target
REMOTE_DIR="/home/fin/apps/erp"    # Remote directory
PM2_PROCESS_NAME="erp"             # PM2 process name

ssh "$TARGET" <<EOF
set -e  # выход при любой ошибке

REMOTE_DIR="$REMOTE_DIR"
PM2_PROCESS_NAME="$PM2_PROCESS_NAME"

export PATH="\$HOME/.local/share/pnpm:\$HOME/.nvm/versions/node/v23.9.0/bin:\$PATH"

# Проверяем, установлен ли pnpm
if ! command -v pnpm &> /dev/null; then
  echo "pnpm not found, installing..."
  curl -fsSL https://get.pnpm.io/install.sh | sh -
fi

cd "\$REMOTE_DIR"

echo "Pulling latest code..."
git pull

echo "Installing server dependencies..."
pnpm install --frozen-lockfile

echo "Building server..."
pnpm run build

echo "Building client..."
cd "\$REMOTE_DIR/client"
pnpm run build:release

echo "Running migrations..."
cd "\$REMOTE_DIR/db"
pnpm run migrate

echo "Updating server public directory..."
cd "\$REMOTE_DIR/server"
rm -rf "\$REMOTE_DIR/server/public"
cp -r "\$REMOTE_DIR/client/build" "\$REMOTE_DIR/server/public"

cd "\$REMOTE_DIR"
echo "Starting/restarting PM2 process..."
if npx pm2 describe "\$PM2_PROCESS_NAME" > /dev/null 2>&1; then
  echo "Process exists. Restarting..."
  npx pm2 restart "\$PM2_PROCESS_NAME"
else
  echo "Process not found. Starting with Node via pnpm..."
  npx pm2 start pnpm --name "\$PM2_PROCESS_NAME" -- run start
fi

echo "Deployment complete. Tailing logs..."
npx pm2 logs "\$PM2_PROCESS_NAME"
EOF