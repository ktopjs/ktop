const ApplicationJob = require('./ApplicationJob')
module.exports = class HelloJob extends ApplicationJob {
  constructor() {
    // every 5 seconds
    super({rule: '*/5 * * * * *'})
  }
  perform() {
    // console.log(this.User)
    console.log('hello world', this.nextInvocation())
  }
}
