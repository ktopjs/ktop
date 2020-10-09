const path = require('path')
const supertest = require('supertest')
const shelljs = require('shelljs')

describe('base test', () => {
  // process.env.CUSTOM_KTOP_PROJECT_PATH = path.resolve(__dirname, '../')
  // shelljs.exec('ktop new test/example')
  // shelljs.exec(`ktop db:migrate -f ./test/example/config/database.config.js`)
  // shelljs.exec(`ktop db:seed -f ./test/example/config/database.config.js`)

  shelljs.exec('npm link')
  shelljs.exec(`rm -f ${ path.resolve(__dirname, '../config/data.test.sqlite') }`)
  shelljs.exec('npm link ktop')
  shelljs.exec(`ktop db:migrate`)
  shelljs.exec(`ktop db:seed`)
  const application = require('../config/application')
  const server = application.listen()
  const request = supertest.agent(server)

  // beforeEach(() => {
  //   jest.useFakeTimers()
  // })
  beforeAll(() => {

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
