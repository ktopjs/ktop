const ApplicationRecord = require('./ApplicationRecord')
class User extends ApplicationRecord {
  get tableName () { return 'users' }

  constructor() {
    super()
  }
}
module.exports = User
