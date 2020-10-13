// loader will auto ignore files who's filename start with .
// https://github.com/koajs/static
// npm install --save koa-static
const path = require('path')
const koaStatic = require('koa-static')
module.exports = koaStatic(path.resolve(__dirname, '../../public'), {
  maxage: 0 // milliseconds
})
