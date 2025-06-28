module.exports = {
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
      cwd: '~/erp/server',
      pre_start: 'pnpm --prefix db migrate'
    }
  ]
}
