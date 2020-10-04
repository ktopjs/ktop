const path = require('path')
const _ = require('lodash')
_.mixin(require('lodash-inflection'))
const projectPath = process.env.CUSTOM_KTOP_PROJECT_PATH || process.cwd()
const knexConfig = require(path.join(projectPath, 'config/database.config.js'))
const knex = require('knex')(knexConfig[process.env.NODE_ENV || 'development'])
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

  get tableName() {
    mapTableName[this.constructor.name] = mapTableName[this.constructor.name] || _.snakeCase(_.pluralize(this.constructor.name))
    return mapTableName[this.constructor.name]
  }
  get hasTimestamps () { return true }

  initialize() {
    this.on('saving', (model) => {
    })
    this.on('creating', (model) => {
    })
    this.on('updating', (model) => {
    })
    this.on('created', (model) => {
    })
    this.on('updated', (model) => {
    })
    this.on('saved', (model) => {
    })
    this.on('destroyed', (model) => {
    })
  }
}
module.exports = KTopModel
