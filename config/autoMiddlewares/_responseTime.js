module.exports = async (ctx, next) => {
  let start = Date.now()
  await next()
  let ms = Date.now() - start
  ctx.set('X-Response-Time', `${ms}ms`)
}
