const { KTopController } = require('@ktopjs/ktop')
class ApplicationController extends KTopController {
  constructor () {
    super(...arguments)
    // this.use(this.authorize)
  }

  // async authorize (ctx, next) {
  //   await next()
  // }
}
module.exports = ApplicationController
