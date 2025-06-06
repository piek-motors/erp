HASURA
http://localhost:60101/console

to run in dev
docker compose -p piekerp up

to run in prod
docker compose -p piekerp --profile production up -d

# procedurs for restoring local db from s3 cloud

brew install restic
cd infra
env $(cat restic.env) restic snapshots
env $(cat restic.env) restic restore <snapshot-id> --target ./restored
docker exec -i erp-postgres psql -U hasura -d postgres < ./restored/data/factory_piek.sql
createuser -U postgres --superuser --pwprompt hasura
