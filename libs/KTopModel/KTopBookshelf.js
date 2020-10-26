const path = require('path')
const _ = require('lodash')
_.mixin(require('lodash-inflection'))
const projectPath = process.env.GLOBAL_DEFINE_KTOP_PROJECT_PATH || process.cwd()
const knexConfig = require(path.join(projectPath, 'config/database.config.js'))
const knex = require('knex')(knexConfig[process.env.NODE_ENV])
const bookshelf = require('bookshelf')(knex)

const mapTableName = {}
// https://github.com/jeff-lewis/cls-hooked
const clsHookedNamespace = require('cls-hooked').createNamespace(`__KTopBookshelf`)

class BaseModel extends bookshelf.Model {
  static get knex () { return knex }
  // transaction
  static async transaction(asyncScopeFunc) {
    return new Promise(async (tResolve, tReject) => {
      await bookshelf['transaction'](trx => {
        new Promise((resolve, reject) => {
          clsHookedNamespace.run(() => {
            clsHookedNamespace.set('trx', trx)
            asyncScopeFunc(clsHookedNamespace).then(data => {
              return trx.commit().then(() => {
                resolve(data)
              })
            }).catch(e => {
              trx.rollback().finally(() => {
                reject(e)
              })
            })
          })
        }).then(tResolve).catch(tReject)
      })
    })
  }

  static get tableName() {
    mapTableName[this.name] = mapTableName[this.name] || _.snakeCase(_.pluralize(this.name))
    return mapTableName[this.name]
  }
  get tableName() {
    return this.constructor.tableName
  }
  constructor() {
    super(...arguments)
  }
  // http://knexjs.org/#Builder-forUpdate
  // https://bookshelfjs.org/api.html#Model-instance-fetch
  // instance withLock (row lock)
  async withLock(asyncScopeFunc) {
    return await this.constructor.transaction(async () => {
      await this.constructor.find(this.id, { lock: 'forUpdate' })
      return await asyncScopeFunc()
    })
  }
  async fetch(options) {
    options = Object.assign({ transacting: clsHookedNamespace.get('trx') }, options)
    return super.fetch(options)
  }
  async fetchAll(options) {
    options = Object.assign({ transacting: clsHookedNamespace.get('trx') }, options)
    return super.fetchAll(options)
  }
  static async create(attrs, options) {
    options = Object.assign({ transacting: clsHookedNamespace.get('trx') }, options)
    return super.create(attrs, options)
  }
  async save(attrs, options) {
    options = Object.assign({ transacting: clsHookedNamespace.get('trx') }, options)
    return super.save(attrs, options)
  }
  async destroy(options) {
    options = Object.assign({ transacting: clsHookedNamespace.get('trx') }, options)
    return super.destroy(options)
  }
}
module.exports = BaseModel
