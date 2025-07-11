# ERP

## 🚀 Running Infrastructure

In Development

`docker compose -p erp up`

In Production
(The main difference that in production mode also starts backup service in the background)

`docker compose -p erp --profile production up -d`
