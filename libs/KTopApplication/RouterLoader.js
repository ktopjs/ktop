const path = require('path')
const requireDirectory = require('require-directory')
const KoaRouter = require('koa-router')
const _ = require('lodash')
class RouterLoader {
  constructor () {
    this.app = null
  }
  installTo (app) {
    this.app = app
    const Routers = requireDirectory(module, app.controllersPath, {include: this.check.bind(this), extensions: ['js']})
    this.register(Routers)
    // mount all models to base class prototype
    Object.keys(app.models).forEach(key => {
      Object.defineProperty(KoaRouter.prototype, key, {
        get () {
          return app.models[key]
        }
      })
    })
  }
  check (fullPath){
    const subPath = fullPath.replace(this.app.controllersPath, '')
    const basename = path.basename(fullPath)
    if (/\/\.|\\\./i.test(subPath) || /^(ApplicationController|BaseController)\./i.test(basename)){
      return false; // don't include
    } else {
      return true; // go ahead and include
    }
  }
  register(Routers, paths = ['']) {
    /object/.test(typeof Routers) && Object.keys(Routers).forEach((key) => {
      let Router = Routers[key]
      // Router isClass
      if (typeof Router === 'function' && /^class\s/.test(Function.prototype.toString.call(Router))) {
        let routeName = Router.name
        let router = new Router({prefix: [...paths, _.camelCase(routeName).replace(/Controller$/, '')].join('/')})
        if (/Controller$/.test(routeName)) {
          this.app.routers.push(router)
          this.app.use(router.routes())
          this.app.use(router.allowedMethods())
        }
      } else {
        paths.push(key)
        this.register(Routers[key], paths)
      }
    })
  }
}
module.exports = RouterLoader
