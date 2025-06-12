# ERP

ERP is a full-stack application built with Node.js, Hasura, PostgreSQL, and React. It provides a user-friendly interface for managing various aspects of a company's operations, including financial data, employee management, and inventory management.

[Local development Hasura UI](http://localhost:60101/console)

---

## 🚀 Running Infrastructure

In Development

`docker compose -p erp up`

In Production
(The main difference that in production mode also starts backup service in the background)

`docker compose -p erp --profile production up -d`
