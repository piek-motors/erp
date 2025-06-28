export default {
  apps: [
    {
      name: 'erp',
      script: 'start',
      watch: false,
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      pre_start: 'pnpm --prefix db migrate'
    }
  ]
}
