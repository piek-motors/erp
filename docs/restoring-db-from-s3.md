# Restoring Local Database from S3 Backup

This guide explains how to restore your local PostgreSQL database from an S3 backup using Restic.

## Prerequisites

- [Homebrew](https://brew.sh/) installed (for macOS)
- Docker and Docker Compose running
- Access to S3 backup credentials

## Steps

### 1. Install Restic

```bash
brew install restic
```

### 2. Access Backup Snapshots

Navigate to the infrastructure directory and list available snapshots:

```bash
cd infra
env $(cat restic.env) restic snapshots
```

This will display a list of available backup snapshots with their IDs.

### 3. Restore Backup

Choose a snapshot ID from the list and restore it:

```bash
env $(cat restic.env) restic restore <snapshot-id> --target ./restored
```

Replace `<snapshot-id>` with the actual snapshot ID you want to restore.

### 4. Import Database

Import the restored SQL dump into your local PostgreSQL database:

```bash
docker exec -i erp-postgres psql -U hasura -d postgres < ./restored/data/factory_piek.sql
```

### 5. Create Database User

If needed, create the Hasura database user:

```bash
createuser -U postgres --superuser --pwprompt hasura
```

## Troubleshooting

- If you encounter permission issues, ensure you have the correct access rights to the S3 bucket
- Verify that the `restic.env` file contains the correct credentials
- Make sure your Docker container is running before attempting to import the database

## Notes

- The restored data will be placed in the `./restored` directory
- Ensure you have sufficient disk space for the restoration process
- It's recommended to backup your current database before performing a restore
