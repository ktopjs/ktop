class KTopJob {
  constructor(options) {
    this.rule = options.rule
    this._job = null
  }
  cancel(reshedule = false) { return this._job.cancel(reshedule) }
  cancelNext(reshedule = false) { return this._job.cancelNext(reshedule) }
  reschedule(spec) { return this._job.reschedule(spec) }
  nextInvocation() { return this._job.nextInvocation() }
  perform() {
    console.log('do nothing')
  }
}
module.exports = KTopJob
