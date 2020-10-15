const Cache = require('memory-cache').Cache
class KTopCache {
  constructor(options = { cache: null, Cache: null }) {
    this.Cache = options && (options.Cache || options.cache && options.cache.constructor) || Cache
    this.cache = options && options.cache || new this.Cache()
    this._runFuncWithIntervalSameCache = new this.Cache()
  }
  async fetch(key, options, assignFunc) {
    if (Number.isInteger(options)) { options = { expiresIn: options } }
    // { expiresIn, assignRunExpiresIn } ms
    options = Object.assign({ assignRunExpiresIn: Math.min(options['expiresIn'], 2000) }, options)
    const value = this.cache.get(key)
    if (value) return value
    const newValue = await this.runFuncWithIntervalSame(key, assignFunc, options.assignRunExpiresIn)
    this.cache.put(key, newValue, options['expiresIn'], function(key, value) {
      // console.log(`key: ${key}, value: ${value} expired`)
    })
    return newValue
  }
  // 防止某一刻缓存失效，高并发, expiresInMillisecond时间内返回同一个Promise, 防止同时重置缓存的值
  async runFuncWithIntervalSame(key, assignFunc, runExpiresIn) {
    let cacheValue = this._runFuncWithIntervalSameCache.get(key)
    if (!cacheValue) {
      cacheValue = assignFunc()
      this._runFuncWithIntervalSameCache.put(key, cacheValue, runExpiresIn)
    }
    const isPromise = Boolean(cacheValue) && typeof cacheValue.then === 'function'
    return isPromise ? (await cacheValue) : cacheValue
  }
  get(key) { return this.cache.get(key) }
  keys() { return this.cache.keys() }
  del(key) { return this.cache.del(key) }
}
module.exports = KTopCache
