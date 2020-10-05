const path = require('path')
process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.CUSTOM_KTOP_PROJECT_PATH = path.resolve(__dirname, '../')
const { KTopApplication } = require('@ktopjs/ktop')
const application = new KTopApplication()

module.exports = application

