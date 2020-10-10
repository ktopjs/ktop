const path = require('path')
const supertest = require('supertest')
const shelljs = require('shelljs')

describe('base test', () => {
  const application = require('../config/application')
  const server = application.listen()
  const request = supertest.agent(server)

  // beforeEach(() => {
  //   jest.useFakeTimers()
  // })
  beforeAll(() => {
    shelljs.exec(`rm -f ${application.knex.client.config.connection.filename}`)
    shelljs.exec(`ktop db:migrate`)
    shelljs.exec(`ktop db:seed`)
  })
  afterAll(() => {
    // shelljs.exec('rm -rf test/example')
  })

  it('hello',  done => {
    request.get('/api/v1/users/hello').expect(200).expect('hello world', done)
  })

  it('get users',  async () => {
    const res = await request.get('/api/v1/users').expect(200)
    expect(res.body.length).toBe(2)
  })

  it('post users',  async () => {
    const res = await request.post('/api/v1/users').send({mobile: '10000000000'}).expect(200)
    expect(res.body.mobile).toBe('10000000000')
  })

  it('update user',  async () => {
    const res = await request.put('/api/v1/users/3').send({mobile: '10000000001'}).expect(200)
    expect(res.body.mobile).toBe('10000000001')
  })

  it('get user',  async () => {
    const res = await request.get('/api/v1/users/3').expect(200)
    expect(res.body.mobile).toBe('10000000001')
  })

  it('get usersCount',  async () => {
    const res = await request.get('/api/v1/users/usersCount').expect(200)
    expect(res.body.beforeCount).toBe(res.body.afterCount - 1)
  })

  it('delete user',  async () => {
    const res = await request.delete('/api/v1/users/3').expect(200)
    expect(res.body.beforeCount).toBe(res.body.afterCount + 1)
  })
})
