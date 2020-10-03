const ApplicationController = require('../../ApplicationController')
class HelloController extends ApplicationController {
  constructor() {
    super(...arguments)
    // super({prefix: '/api/v1/hello'})
    this.get('/', this.index.bind(this))
    this.get('/usersCount', this.usersCount.bind(this))
  }
  async index (ctx, next) {
    ctx.body = 'hello world'
  }
  async usersCount (ctx, next) {
    // await this.User.count() === await ctx.app.models.User.count()
    // http://knexjs.org/
    // https://bookshelfjs.org/api.html
    ctx.body = await this.User.count()
  }
}
module.exports = HelloController
