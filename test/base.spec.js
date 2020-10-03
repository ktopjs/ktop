const supertest = require('supertest')
const shelljs = require('shelljs')

describe('base test', () => {
  // process.env.CUSTOM_KTOP_PROJECT_PATH = path.resolve(__dirname, 'example')
  // shelljs.exec('ktop new test/example')
  // shelljs.exec(`ktop db:migrate -f ./test/example/config/database.config.js`)
  // shelljs.exec(`ktop db:seed -f ./test/example/config/database.config.js`)

  shelljs.exec('npm link @ktopjs/ktop')
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
    request.get('/api/v1/hello').expect(200).expect('hello world', done)
  })

  it('usersCount',  done => {
    request.get('/api/v1/hello/usersCount').expect(200).expect('3', done)
  })
})
