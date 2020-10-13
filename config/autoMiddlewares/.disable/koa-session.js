// https://github.com/koajs/session
// npm i koa-session -S
const session = require('koa-session')
const config = {
  key: 'ktop.app',
  httpOnly: true
}
module.exports = {
  installTo(app) {
    app.keys = ['ktop app secret key']
    app.use(session(config, app))
  }
}
