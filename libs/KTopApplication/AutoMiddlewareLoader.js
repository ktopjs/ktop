const requireDirectory = require('require-directory')
const path = require('path')
class AutoMiddlewareLoader {
  constructor () {
    this.app = null
  }
  installTo (app) {
    this.app = app
    const middleWares = requireDirectory(module, app.autoMiddlewaresPath, {include: this.check, extensions: ['js']})
    this.register(middleWares)
  }
  check (fullPath){
    const basename = path.basename(fullPath)
    // 不加载.开头的文件(隐藏文件)
    if (/^\./i.test(basename)){
      return false; // don't include
    } else {
      return true; // go ahead and include
    }
  }
  register(middleWares) {
    /object/.test(typeof middleWares) && Object.keys(middleWares).sort().forEach((key) => {
      const middleware = middleWares[key]
      this.app.use(middleware)
    })
  }
}
module.exports = AutoMiddlewareLoader
