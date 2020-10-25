const KtopModelBase = require('./KtopModelBase')

class KTopModel extends KtopModelBase {
  constructor() {
    super(...arguments)
  }
  get hasTimestamps () { return ['created_at', 'updated_at'] }
}

module.exports = KTopModel
