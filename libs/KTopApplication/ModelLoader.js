const requireDirectory = require('require-directory')
const path = require('path')

class ModelLoader {
  constructor () {
    this.app = null
  }
  installTo (app) {
    this.app = app
    const Models = requireDirectory(module, app.modelsPath, {include: this.check.bind(this), extensions: ['js']})
    this.register(Models)
  }
  check (fullPath){
    const subPath = fullPath.replace(this.app.modelsPath, '')
    const basename = path.basename(fullPath)
    if (/\/\.|\\\./i.test(subPath) || /^(ApplicationRecord)\./i.test(basename)){
      return false; // don't include
    } else {
      return true; // go ahead and include
    }
  }
  register(Models) {
    /object/.test(typeof Models) && Object.keys(Models).forEach((key) => {
      let Model = Models[key]
      // Model isClass
      if (typeof Model === 'function' && /^class\s/.test(Function.prototype.toString.call(Model))) {
        const modelConfigClassName = Models[key].name
        this.app.models[modelConfigClassName] = Models[key]
      } else {
        this.register(Models[key])
      }
    })
  }
}

module.exports = ModelLoader
