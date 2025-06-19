import dotenv from 'dotenv'
dotenv.config({ path: '../.env' })

function validate<T>(config: T): T {
  for (const [key, value] of Object.entries(config as any)) {
    if (!value) {
      throw new Error(`Missing key ${key} in .env`)
    }
  }
  return config
}

type EnvironmentConfig = {
  NODE_ENV: string
  PORT: number
  BUILD_PATH: string
  CORS_CLIENT_URL: string
  HASURA_ADMIN_SECRET: string
  HASURA_ENDPOINT: string
  JWT_ACCESS_SECRET: string
  JWT_REFRESH_SECRET: string
  JWT_ACCESS_SECRET_EXPIRES: string
  JWT_REFRESH_SECRET_EXPIRES: string
  S3_ACCESS_KEY_ID: string
  S3_SECRET_ACCESS_KEY: string
  S3_BUCKET: string
  S3_ENDPOINT: string
  PG_CONN_STR: string
}

const { env } = process
export const config = validate({
  NODE_ENV: env.NODE_ENV,

  PORT: env.Port ? Number(env.PORT) : 9000,
  BUILD_PATH: env.BUILD_PATH,
  CORS_CLIENT_URL: env.CORS_CLIENT_URL,

  HASURA_ADMIN_SECRET: env.HASURA_ADMIN_SECRET,
  HASURA_ENDPOINT: env.HASURA_ENDPOINT,

  JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
  JWT_ACCESS_SECRET_EXPIRES: env.JWT_ACCESS_SECRET_EXPIRES ?? '30m',
  JWT_REFRESH_SECRET_EXPIRES: env.JWT_REFRESH_SECRET_EXPIRES ?? '30d',

  S3_ACCESS_KEY_ID: env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: env.S3_SECRET_ACCESS_KEY,
  S3_BUCKET: env.S3_BUCKET ?? 'factory-piek-test',
  S3_ENDPOINT: env.S3_ENDPOINT ?? 's3.yandexcloud.net',

  PG_CONN_STR: env.PG_CONN_STR
}) as EnvironmentConfig
