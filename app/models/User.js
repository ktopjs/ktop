const ApplicationRecord = require('./ApplicationRecord')
class User extends ApplicationRecord {
  // get tableName () { return 'users' }
  // get hasTimestamps () { return true }

  constructor() {
    super(...arguments)
  }
}
module.exports = User
