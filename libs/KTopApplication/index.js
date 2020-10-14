const path = require('path')
const Koa = require('koa')
const ModelLoader = require('./ModelLoader')
const JobLoader = require('./JobLoader')
const AutoMiddlewareLoader = require('./AutoMiddlewareLoader')
const RouterLoader = require('./RouterLoader')
const KTopCache = require('../KTopCache')
class Application extends Koa {
  constructor(config, ...otherOptions) {
    super(...otherOptions)
    this.config = config || {}
    this.kTopCache = new KTopCache()

    this.projectPath = process.env.GLOBAL_DEFINE_KTOP_PROJECT_PATH || process.cwd()
    this.modelsPath = path.join(this.projectPath, 'app/models')
    this.jobsPath = path.join(this.projectPath, 'app/jobs')
    this.autoMiddlewaresPath = path.join(this.projectPath, 'config/autoMiddlewares')
    this.controllersPath = path.join(this.projectPath, 'app/controllers')
    this.knex = require('../KTopModel').knex
    this.models = {}
    this.routers = []
    this.jobs = []

    this.use(ModelLoader)
    this.use(JobLoader)
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
  shareAttrsTo(obj) {
    const app = this
    Object.defineProperty(obj, '$', { get () { return app } })
    Object.keys(app.models).forEach(key => {
      Object.defineProperty(obj, key, {
        get () {
          return app.models[key]
        }
      })
    })
  }
}
module.exports = Application
