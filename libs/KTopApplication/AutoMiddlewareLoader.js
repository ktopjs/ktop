const requireDirectory = require('require-directory')
const path = require('path')
class AutoMiddlewareLoader {
  constructor () {
    this.app = null
  }
  installTo (app) {
    this.app = app
    const middleWares = requireDirectory(module, app.autoMiddlewaresPath, {include: this.check.bind(this), extensions: ['js']})
    this.register(middleWares)
  }
  check (fullPath){
    const subPath = fullPath.replace(this.app.autoMiddlewaresPath, '')
    // const basename = path.basename(fullPath)
    // 不加载.开头的文件或文件夹(隐藏文件)
    if (/\/\.|\\\./i.test(subPath)){
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
