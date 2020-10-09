const path = require('path')
const Joi = require('joi')
const _ = require('lodash')
_.mixin(require('lodash-inflection'))
const projectPath = process.env.GLOBAL_DEFINE_KTOP_PROJECT_PATH || process.cwd()
const knexConfig = require(path.join(projectPath, 'config/database.config.js'))
const knex = require('knex')(knexConfig[process.env.NODE_ENV])
const bookshelf = require('bookshelf')(knex)

const mapTableName = {}
class KTopModel extends bookshelf.Model {
  static all(filterAttrs, options) {
    return this.forge().where(Object.assign({}, filterAttrs)).fetchAll(options)
  }
  static find (filterAttrs, options) {
    options = Object.assign({ require: true }, options)
    return this.forge(filterAttrs).fetch(options)
  }
  static findBy(column, value) {
    return this.find({ [column]: value }, { require: false })
  }
  static findById (id) {
    return this.find({ [this.prototype.idAttribute]: id }, { require: false })
  }
  static findOrCreateBy(attrs, options) {
    options = Object.assign({ require: false }, options)
    return this.find(attrs, options).then(model => {
      return model || this.create(attrs, options)
    })
  }
  static create (creatAttrs, options) {
    options = Object.assign({method: 'insert'}, options)
    return new this(creatAttrs).save(null, options)
  }
  static update (findAttrs, updateAttrs, options) {
    options = Object.assign({ patch: true, require: true }, options)
    return new this(findAttrs).save(updateAttrs, options)
  }
  static destroy (findAttrs, options) {
    options = Object.assign({ require: true }, options)
    return new this(findAttrs).destroy(options)
  }

  constructor() {
    super(...arguments)
  }
  get Joi() { return Joi }
  get tableName() {
    mapTableName[this.constructor.name] = mapTableName[this.constructor.name] || _.snakeCase(_.pluralize(this.constructor.name))
    return mapTableName[this.constructor.name]
  }
  get hasTimestamps () { return ['created_at', 'updated_at'] }

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
module.exports = KTopModel
