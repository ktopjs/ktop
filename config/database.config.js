const path = require('path')
const base = {
  client: 'sqlite3',
  useNullAsDefault: true,
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
    debug: true
  },
  production: {
    ...base,
    connection: {
      filename: path.join(__dirname, 'data.production.sqlite')
    }
  },
  test: {
    ...base,
    connection: {
      filename: path.join(__dirname, 'data.test.sqlite')
    }
    // connection: ":memory:"
  }
}
module.exports = config
