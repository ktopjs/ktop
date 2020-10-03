const path = require('path')
const projectPath = process.env.CUSTOM_KTOP_PROJECT_PATH || process.cwd()
const knexConfig = require(path.join(projectPath, 'config/database.config.js'))
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development'])
const bookshelf = require('bookshelf')(knex)
class KTopModel extends bookshelf.Model {
  constructor() {
    super(...arguments)
  }
}
module.exports = KTopModel
