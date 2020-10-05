const ApplicationController = require('./ApplicationController')
class HomeController extends ApplicationController {
  constructor(options, ...otherArgs) {
    super({...options, prefix: '/'}, ...otherArgs)
    this.get('/', this.index.bind(this))
  }
  index (ctx) {
    ctx.body = 'Welcome to ktop application'
  }
}
module.exports = HomeController
