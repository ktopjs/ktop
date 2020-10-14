describe('cache test', () => {
  const application = require('../config/application')
  beforeEach(() => {
    // jest.useFakeTimers()
    jest.setTimeout(20000)
  })
  it('fetch',  async () => {
    let totalFetchCount = 0
    const assignCount = await new Promise(async (resolve) => {
      return new Promise(resolve1 => {
        let tmpAssignCount = 0
        // process.env.current = new Date().getTime()
        const interval = setInterval(() => {
          totalFetchCount++
          application.kTopCache.fetch('hello', 1, async () => {
            tmpAssignCount++
            // console.log('...', new Date().getTime() - process.env.current)
            return new Promise((resolve1, reject) => {
              setTimeout(() => {
                resolve1(new Date().getTime())
              }, 100)
            })
          })
        })
        setTimeout(() => {
          clearInterval(interval)
          resolve(tmpAssignCount)
        }, 4000)
      })
    })
    // expect(assignCount).toBeGreaterThanOrEqual(4)
    // expect(assignCount).toBeLessThanOrEqual(4)
    expect(totalFetchCount).toBeGreaterThanOrEqual(1000)
    // 23 1136 2240 3343
    expect(assignCount).toEqual(4)
  })
})
