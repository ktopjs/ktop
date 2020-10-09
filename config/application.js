const path = require('path')
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.GLOBAL_DEFINE_KTOP_PROJECT_PATH = path.resolve(__dirname, '../')
const { KTopApplication } = require('ktop')

const application = new KTopApplication()

module.exports = application

