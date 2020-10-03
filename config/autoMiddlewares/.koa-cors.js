// loader will auto ignore files who's filename start with .
// npm install --save koa2-cors
const cors = require('koa2-cors')
module.exports = cors({
  // true: allow cookie, frontend eg: vue axios please set {withCredentials: true}
  credentials: false
})
