module.exports = {
  apps: [
    {
      name: 'erp',
      script: 'server/dist/main.js',
      watch: false,
      env: {
        NODE_ENV: 'development'
      },
      env_production: {
        NODE_ENV: 'production'
      },
      pre_start: 'npm --prefix server run migrate'
    }
  ]
}
