#!/bin/bash
# Build client locally
echo "Building client app..."
cd ./client || exit 1
npm run build:release || { echo "Client build failed"; exit 1; }
cd ..
# Commit build artifacts and push to repo
echo "Committing and pushing build artifacts..."
git add client/build || true
git commit -m "chore: build client before deploy" || true
git push

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
  pnpm i --frozen-lockfile

  cd ~/erp/domain-model
  npm run build

  cd ~/erp/server
  npm run build

  cd ~/erp/db
  npm run migrate

  cd ~/erp/server
  
  if npx pm2 describe "$PM2_PROCESS_NAME" > /dev/null; then
    echo "Process exists. Restarting..."
    npx pm2 restart "$PM2_PROCESS_NAME"
  else
    echo "Process not found. Starting..."
    npx pm2 start ./dist/src/main.js --name "$PM2_PROCESS_NAME"
  fi

EOF