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

const { env } = process

const rawConfig = {
  NODE_ENV: env.NODE_ENV,

  PORT: env.PORT ? Number(env.PORT) : 9000,
  BUILD_PATH: env.BUILD_PATH,
  CORS_CLIENT_URL: env.CORS_CLIENT_URL,

  JWT_ACCESS_SECRET: env.JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET: env.JWT_REFRESH_SECRET,
  JWT_ACCESS_SECRET_EXPIRES: env.JWT_ACCESS_SECRET_EXPIRES ?? '30m',
  JWT_REFRESH_SECRET_EXPIRES: env.JWT_REFRESH_SECRET_EXPIRES ?? '7d',

  S3_ACCESS_KEY_ID: env.S3_ACCESS_KEY_ID,
  S3_SECRET_ACCESS_KEY: env.S3_SECRET_ACCESS_KEY,
  S3_BUCKET: env.S3_BUCKET ?? 'factory-piek-test',
  S3_ENDPOINT: env.S3_ENDPOINT?.startsWith('http')
    ? env.S3_ENDPOINT
    : `https://${env.S3_ENDPOINT ?? 's3.yandexcloud.net'}`,

  PG_CONN_STR: env.PG_CONN_STR,
}

type Validated<T> = {
  [K in keyof T]-?: NonNullable<T[K]>
}

export const config = validate(rawConfig) as Validated<typeof rawConfig>
