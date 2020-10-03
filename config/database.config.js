const path = require('path')
const base = {
  client: 'sqlite3',
  migrations: {
    directory: '../db/migrate',
    tableName: 'migrations'
  },
  seeds: {
    directory: '../db/seeds'
  }
}
const config = {
  development: {
    ...base,
    connection: {
      filename: path.join(__dirname, 'data.development.sqlite')
    },
    useNullAsDefault: true,
    debug: true
  },
  production: {
    ...base,
    connection: {
      filename: path.join(__dirname, 'data.production.sqlite')
    },
    useNullAsDefault: true
  },
  test: {
    ...base,
    connection: {
      filename: path.join(__dirname, 'data.test.sqlite')
    },
    useNullAsDefault: true
  }
}
module.exports = config
