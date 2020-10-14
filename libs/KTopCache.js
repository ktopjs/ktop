const cache = require('memory-cache')
class KTopCache {
  constructor(options = { cache: null, Cache: null }) {
    this.cache = options && options.cache || cache
    this.Cache = options && options.Cache || cache.Cache
    this._runFuncWithIntervalSameCache = new this.Cache()
  }
  async fetch(key, expiresInSeconds, assignValueFunc) {
    const expiresInMillisecond = expiresInSeconds * 1000
    const value = cache.get(key)
    if (value) return value
    const newValue = await this.runFuncWithIntervalSame(key, assignValueFunc, Math.min(expiresInMillisecond, 2000))
    this.cache.put(key, newValue, expiresInMillisecond || undefined)
    return newValue
  }
  // 防止某一刻缓存失效，高并发, expiresInMillisecond时间内返回同一个Promise, 防止同时重置缓存的值
  async runFuncWithIntervalSame(key, funcAsync, expiresInMillisecond) {
    let cacheValue = this._runFuncWithIntervalSameCache.get(key)
    if (!cacheValue) {
      cacheValue = funcAsync()
      this._runFuncWithIntervalSameCache.put(key, cacheValue, expiresInMillisecond)
    }
    return await cacheValue
  }
}
module.exports = KTopCache
