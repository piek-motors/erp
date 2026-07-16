# Restoring Local Database from S3 Backup

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
```bash
cd infra
env $(cat restic_erp.env) restic snapshots
```

### 3. Restore Backup
```bash
env $(cat restic_erp.env) restic restore <snapshot-id> --target ./restored
```

### 4. Import Database
```bash
docker exec -i erp-postgres psql -U hasura -d postgres < ./restored/data/factory_piek.sql
```

### 5. Create Database User
```bash
createuser -U postgres --superuser --pwprompt hasura
```

### Remove ols snapshots 
env $(cat restic.env) restic forget --keep-within 3m --group-by ''
