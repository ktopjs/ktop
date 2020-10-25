const Joi = require('joi')
const KTopBookShelf = require('./KTopBookshelf')
class KTopModelBase extends KTopBookShelf {
  static new(attrs) {
    return new this(attrs)
  }
  static all(whereAttrs, options) {
    options = Object.assign({}, options)
    return this.forge().where(Object.assign({}, whereAttrs)).fetchAll(options)
  }
  static async find (id, options) {
    options = Object.assign({ require: true }, options)
    // return this.forge({[this.prototype.idAttribute]: id}).fetch(options)
    // return new this({[this.prototype.idAttribute]: id}).fetch(options)
    return this.new({[this.prototype.idAttribute]: id}).fetch(options)
  }
  static findById (id) {
    return this.find(id, { require: false })
  }
  static findBy(column, value) {
    const options = { require: false }
    return this.new({ [column]: value }).fetch(options)
  }
  static findOrCreateBy(attrs, options) {
    options = Object.assign({ require: false }, options)
    return this.where(attrs).fetch(options).then(model => {
      return model || this.create(attrs, options)
    })
  }
  static create (creatAttrs, options) {
    options = Object.assign({ method: 'insert' }, options)
    return this.new(creatAttrs).save(null, options)
  }
  static update (whereAttrs, updateAttrs, options) {
    options = Object.assign({ patch: true, require: true }, options)
    return this.new(whereAttrs).save(updateAttrs, options)
  }
  static destroy (whereAttrs, options) {
    options = Object.assign({ require: true }, options)
    return this.new (whereAttrs).destroy(options)
  }
  constructor() {
    super(...arguments)
  }
  get Joi() { return Joi }
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
module.exports = KTopModelBase
