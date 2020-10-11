// loader will auto ignore files who's filename start with .
// npm install --save koa-static
const path = require('path')
const koaStatic = require('koa-static')
module.exports = koaStatic(path.resolve(__dirname, '../../public'))
