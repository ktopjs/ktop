const path = require('path')
const requireDirectory = require('require-directory')
const _ = require('lodash')
class Router {
  constructor () {
    this.app = null
  }
  installTo (app) {
    this.app = app
    const Routers = requireDirectory(module, app.controllersPath, {include: this.check, extensions: ['js']})
    this.register(Routers)
  }
  check (fullPath){
    const basename = path.basename(fullPath)
    if (/^(\.|(Application|Base)Controller\.js).*/i.test(basename)){
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
module.exports = Router
