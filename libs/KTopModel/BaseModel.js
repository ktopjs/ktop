const path = require('path')
const Joi = require('joi')
const _ = require('lodash')
_.mixin(require('lodash-inflection'))
const projectPath = process.env.GLOBAL_DEFINE_KTOP_PROJECT_PATH || process.cwd()
const knexConfig = require(path.join(projectPath, 'config/database.config.js'))
const knex = require('knex')(knexConfig[process.env.NODE_ENV])
const bookshelf = require('bookshelf')(knex)

const mapTableName = {}
// https://github.com/jeff-lewis/cls-hooked
const clsHookedNamespace = require('cls-hooked').createNamespace(`__KTopBaseModel`)

class BaseModel extends bookshelf.Model {
  static get knex () { return knex }
  static whereAttrs(whereAttrs) {
    return new this(whereAttrs)
  }
  static all(whereAttrs, options) {
    options = Object.assign({ transacting: clsHookedNamespace.get('trx') }, options)
    return this.forge().where(Object.assign({}, whereAttrs)).fetchAll(options)
  }
  static async find (id, options) {
    options = Object.assign({ require: true, transacting: clsHookedNamespace.get('trx') }, options)
    // return this.forge({[this.prototype.idAttribute]: id}).fetch(options)
    // return new this({[this.prototype.idAttribute]: id}).fetch(options)
    return this.whereAttrs({[this.prototype.idAttribute]: id}).fetch(options)
  }
  static findById (id) {
    return this.find(id, { require: false })
  }
  static findBy(column, value) {
    const options = { require: false }
    return this.whereAttrs({ [column]: value }).fetch(options)
  }
  static findOrCreateBy(attrs, options) {
    options = Object.assign({ require: false, transacting: clsHookedNamespace.get('trx') }, options)
    return this.where(attrs).fetch(options).then(model => {
      return model || this.create(attrs, options)
    })
  }
  static create (creatAttrs, options) {
    options = Object.assign({ method: 'insert', transacting: clsHookedNamespace.get('trx') }, options)
    return this.whereAttrs(creatAttrs).save(null, options)
  }
  static update (whereAttrs, updateAttrs, options) {
    options = Object.assign({ patch: true, require: true, transacting: clsHookedNamespace.get('trx') }, options)
    return this.whereAttrs(whereAttrs).save(updateAttrs, options)
  }
  static destroy (whereAttrs, options) {
    options = Object.assign({ require: true, transacting: clsHookedNamespace.get('trx') }, options)
    return this.whereAttrs(whereAttrs).destroy(options)
  }
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
  initialize() {
    this.on('saving', async (model) => {
      // validate error will throw a error
      await this.joiValidate()
      model.beforeSave && model.beforeSave()
    })
    this.on('creating', async (model) => {
      model.beforeCreate && await model.beforeCreate()
    })
    this.on('updating', async (model) => {
      model.beforeUpdate && await model.beforeUpdate()
    })
    this.on('created', async (model) => {
      model.afterCreate && await model.afterCreate()
    })
    this.on('updated', async (model) => {
      model.afterUpdate && await model.afterUpdate()
    })
    this.on('saved', async (model) => {
      model.afterSave && await model.afterSave()
    })
    this.on('destroyed', async (model) => {
      model.afterDestroy && await model.afterDestroy()
    })
  }
  get Joi() { return Joi }
  get hasTimestamps () { return ['created_at', 'updated_at'] }

  // http://knexjs.org/#Builder-forUpdate
  // https://bookshelfjs.org/api.html#Model-instance-fetch
  // instance withLock (row lock)
  async withLock(asyncScopeFunc) {
    return await this.constructor.transaction(async () => {
      await this.constructor.find(this.id, { lock: 'forUpdate' })
      return await asyncScopeFunc()
    })
  }
  async joiValidate () {
    if (this.validates) {
      const baseValidation = {
        // id might be number or string, for optimization
        id: Joi.any().optional(),
        created_at: Joi.date().optional(),
        updated_at: Joi.date().optional()
      }
      const schema = Joi.object({...baseValidation, ...this.validates})
      // const { error, value } = schema.validate(this.attributes)
      return await schema.validateAsync(this.attributes)
    }
  }
}
module.exports = BaseModel
