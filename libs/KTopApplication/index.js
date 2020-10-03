const path = require('path')
const Koa = require('koa')
const Model = require('./Model')
const AutoMiddleware = require('./AutoMiddleware')
const Router = require('./Router')
class Application extends Koa {
  constructor() {
    super(...arguments)
    this.projectPath = process.env.CUSTOM_KTOP_PROJECT_PATH || process.cwd()
    this.modelsPath = path.join(this.projectPath, 'app/models')
    this.controllersPath = path.join(this.projectPath, 'app/controllers')
    this.autoMiddlewaresPath = path.join(this.projectPath, 'config/autoMiddlewares')
    this.models = {}

    this.use(Model)
    this.use(AutoMiddleware)
    this.use(Router)
  }
  use (plugin) {
    if (/object/.test(typeof plugin) && plugin['installTo']) { // isObject
      plugin['installTo'](this)
    } else if (typeof plugin === 'function' && /^class\s/.test(Function.prototype.toString.call(plugin))) { // isClass
      this.use(new plugin())
    } else {
      super.use(plugin.bind(this))
    }
  }
}
module.exports = Application
