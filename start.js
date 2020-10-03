const application = require('./config/application')
const port = 3000
application.listen(port, () => {
  console.log(`app start at: http://localhost:${port}`)
})
