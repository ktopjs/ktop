const ApplicationRecord = require('./ApplicationRecord')
class User extends ApplicationRecord {
  // get tableName () { return 'users' }
  // get hasTimestamps () { return true }
  get defaults() {
    return { gender: 'male' }
  }

  constructor() {
    super(...arguments)
  }
  get validates () {
    return {
      mobile: this.Joi.string(),
      gender: this.Joi.string()
    }
  }

  beforeSave () { console.log('beforeSave') }
  beforeCreate () { console.log('beforeCreate') }
  beforeUpdate () { console.log('beforeUpdate') }
  afterCreate () { console.log('afterCreate') }
  afterUpdate () { console.log('afterUpdate') }
  afterSave () { console.log('afterSave') }
  beforeDestroy () { console.log('beforeDestroy') }
  afterDestroy () { console.log('afterDestroy') }
}
module.exports = User
