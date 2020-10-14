const requireDirectory = require('require-directory')
const nodeSchedule = require('node-schedule')
const path = require('path')
const KTopJob = require('../KTopJob')

class ModelLoader {
  constructor () {
    this.app = null
  }
  installTo (app) {
    this.app = app
    const Jobs = requireDirectory(module, app.jobsPath, {include: this.check.bind(this), extensions: ['js']})
    this.register(Jobs)
    // mount all models to base class prototype
    app.shareAttrsTo(KTopJob.prototype)
  }
  check (fullPath){
    const subPath = fullPath.replace(this.app.jobsPath, '')
    const basename = path.basename(fullPath)
    if (/\/\.|\\\./i.test(subPath) || /^(ApplicationJob)\./i.test(basename)){
      return false; // don't include
    } else {
      return true; // go ahead and include
    }
  }
  register(Jobs) {
    /object/.test(typeof Jobs) && Object.keys(Jobs).forEach((key) => {
      let Job = Jobs[key]
      // Job isClass
      if (typeof Job === 'function' && /^class\s/.test(Function.prototype.toString.call(Job))) {
        // const jobClassName = Jobs[key].name
        const jobInstance = new Job()
        this.app.jobs.push(jobInstance)
        if (!process.env.GLOBAL_DEFINE_KTOP_PROJECT_RUNNING_IN_CONSOLE) {
          jobInstance._job = nodeSchedule.scheduleJob({rule: jobInstance.rule, tz: this.app.config.timezone}, jobInstance.perform.bind(jobInstance))
        }
      } else {
        this.register(Jobs[key])
      }
    })
  }
}

module.exports = ModelLoader
