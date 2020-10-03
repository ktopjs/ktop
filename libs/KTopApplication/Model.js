const requireDirectory = require('require-directory')
const KoaRouter = require('koa-router')
const path = require('path')

class Model {
  constructor () {
    this.app = null
  }
  installTo (app) {
    this.app = app
    const Models = requireDirectory(module, app.modelsPath, {include: this.check, extensions: ['js']})
    this.register(Models)
  }
  check (fullPath){
    const basename = path.basename(fullPath)
    if (/^(\.|ApplicationRecord\.js)/i.test(basename)){
      return false; // don't include
    } else {
      return true; // go ahead and include
    }
  }
  register(Models) {
    /object/.test(typeof Models) && Object.keys(Models).forEach((key) => {
      const modelConfigClassName = Models[key].name
      this.app.models[modelConfigClassName] = Models[key]
      Object.defineProperty(KoaRouter.prototype, modelConfigClassName, {
        get () {
          return Models[key]
        }
      })
    })
  }
}

module.exports = Model
