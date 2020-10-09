const path = require('path')
const Koa = require('koa')
const ModelLoader = require('./ModelLoader')
const AutoMiddlewareLoader = require('./AutoMiddlewareLoader')
const RouterLoader = require('./RouterLoader')
class Application extends Koa {
  constructor() {
    super(...arguments)
    this.projectPath = process.env.GLOBAL_DEFINE_KTOP_PROJECT_PATH || process.cwd()
    this.modelsPath = path.join(this.projectPath, 'app/models')
    this.controllersPath = path.join(this.projectPath, 'app/controllers')
    this.autoMiddlewaresPath = path.join(this.projectPath, 'config/autoMiddlewares')
    this.models = {}

    this.use(ModelLoader)
    this.use(AutoMiddlewareLoader)
    this.use(RouterLoader)
  }
  use (plugin) {
    if (/object/.test(typeof plugin) && plugin['installTo']) { // isObject
      plugin['installTo'](this)
    } else if (typeof plugin === 'function' && /^class\s/.test(Function.prototype.toString.call(plugin))) { // isClass
      this.use(new plugin())
    } else {
      if (Array.isArray(plugin)) {
        plugin.forEach(item => super.use(item.bind(this)))
      } else {
        super.use(plugin.bind(this))
      }
    }
  }
}
module.exports = Application
