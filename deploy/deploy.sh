#!/bin/bash

# Remote host details
remote_host="piek"
project_dir="~/erp"
pm2_process_name="erp"

remote_commands=$(cat <<EOF
  set -e
  cd $project_dir
  echo "Pulling latest changes from origin/main..."
  git fetch origin
  git checkout main
  git pull origin main
  echo "Stopping PM2 process: $pm2_process_name"
  pm2 stop $pm2_process_name || true
  echo "Starting PM2 process: $pm2_process_name"
  pm2 start $pm2_process_name || pm2 start npm --name "$pm2_process_name" -- start
  pm2 save
EOF
)

# Function to add a prefix to each line
add_prefix() {
  while IFS= read -r line; do
    echo "[Remote] $line"
  done
}

# Execute remote commands and capture output with prefix
ssh "$remote_host" "$remote_commands" | add_prefix
