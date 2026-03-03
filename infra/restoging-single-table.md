# Шаг 1 — сделать дамп таблицы

```bash
docker exec erp-postgres \
  pg_dump -U hasura -d postgres \
  -t table \
  --data-only \
  -Fc \
  -f /tmp/employees.dump
```

# Шаг 2 — скопировать файл на свою машину

```bash
docker cp erp-postgres:/tmp/employees.dump ./employees.dump
```

# Шаг 3 — отправить файл на prod-сервер

```bash
scp ./employees.dump user@prod-server:/tmp/employees.dump
```

# Шаг 4 — скопировать файл в prod-контейнер

На prod-сервере:

```bash
docker cp /tmp/employees.dump erp-postgres:/tmp/employees.dump
```


# Шаг 5 — восстановить в production

Если нужно **заменить данные полностью**:

```bash
docker exec -i erp-postgres \
  psql -U hasura -d postgres \
  -c "TRUNCATE TABLE table;"
```

Затем:

```bash
docker exec erp-postgres \
  pg_restore -U hasura -d postgres \
  -t table \
  --data-only \
  /tmp/employees.dump
```

# Шаг 6 — поправить sequence
```bash
docker exec -i erp-postgres \
  psql -U hasura -d postgres \
  -c "SELECT setval(
        pg_get_serial_sequence('table','id'),
        (SELECT MAX(id) FROM table)
      );"
```

# Важно
Перед этим обязательно сделай бэкап прод-таблицы:

```bash
docker exec erp-postgres \
  pg_dump -U hasura -d postgres \
  -t table \
  -Fc \
  -f /tmp/employees_backup.dump
```