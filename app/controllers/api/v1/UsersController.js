const ApplicationController = require('../../ApplicationController')
class UsersController extends ApplicationController {
  constructor() {
    super(...arguments)
    // super({prefix: '/api/v1/users'})
    this.get('/', this.index.bind(this))
    this.get('/hello', this.hello.bind(this))
    this.get('/usersCount', this.usersCount.bind(this))
    this.get('/:id', this.show.bind(this))
    this.post('/', this.create.bind(this))
    this.put('/:id', this.update.bind(this))
    this.delete('/:id', this.destroy.bind(this))
  }
  async index (ctx, next) {
    ctx.body = await this.User.all()
  }
  async create (ctx, next) {
    const user = await this.User.create({mobile: ctx.params.mobile})
    ctx.body = user
  }
  async update (ctx, next) {
    const user = await this.User.update({id: ctx.params.id}, {mobile: ctx.params.mobile})
    ctx.body = user
  }
  async show (ctx, next) {
    // query direct
    const tmpUser = await this.User.find(ctx.params.id)

    // query with transaction
    // const user = await this.User.transaction(async () => {
    //   return await this.User.find(ctx.params.id)
    // })

    // query withLock
    const user = await tmpUser.withLock(async () => {
      return await this.User.find(ctx.params.id)
    })
    ctx.body = user
  }
  async destroy(ctx, next) {
    const beforeCount = await this.User.count()
    await this.User.destroy({id: ctx.params.id})
    const afterCount = await this.User.count()
    ctx.body = {beforeCount, afterCount}
  }
  async hello (ctx, next) {
    ctx.body = 'hello world'
  }
  async usersCount (ctx, next) {
    // await this.User.count() === await ctx.app.models.User.count()
    // http://knexjs.org/
    // https://bookshelfjs.org/api.html
    const beforeCount = await this.User.count()
    await this.User.findOrCreateBy({mobile: '12300000000'})
    await this.User.findOrCreateBy({mobile: '12300000000'})
    const afterCount = await this.User.count()
    ctx.body = {beforeCount, afterCount}

  }
}
module.exports = UsersController
