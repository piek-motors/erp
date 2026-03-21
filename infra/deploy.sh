#!/bin/bash

TARGET="piek-office"               # SSH target
REMOTE_DIR="/home/fin/apps/erp"    # Remote directory
PM2_PROCESS_NAME="erp"             # PM2 process name

ssh "$TARGET" <<EOF
set -e  # выход при любой ошибке

REMOTE_DIR="$REMOTE_DIR"
PM2_PROCESS_NAME="$PM2_PROCESS_NAME"

# Определяем путь к bun
BUN_BIN="\$HOME/.bun/bin/bun"

# Проверяем, установлен ли bun
if [ ! -f "\$BUN_BIN" ]; then
  echo "Bun not found, installing..."
  curl -fsSL https://bun.sh/install | bash
fi

# Добавляем Bun, pnpm и Node в PATH
export PATH="\$HOME/.bun/bin:\$HOME/.local/share/pnpm:\$HOME/.nvm/versions/node/v23.9.0/bin:\$PATH"

cd "\$REMOTE_DIR"

echo "Pulling latest code..."
git pull

echo "Installing server dependencies..."
"\$BUN_BIN" install --frozen-lockfile

echo "Building server..."
"\$BUN_BIN" run build

echo "Building client..."
cd "\$REMOTE_DIR/client"
"\$BUN_BIN" run build:release

echo "Running migrations..."
cd "\$REMOTE_DIR/db"
"\$BUN_BIN" run migrate

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
  echo "Process not found. Starting..."
  npx pm2 start "\$BUN_BIN" --name "\$PM2_PROCESS_NAME" -- run "start"
fi

echo "Deployment complete. Tailing logs..."
npx pm2 logs "\$PM2_PROCESS_NAME"
EOF