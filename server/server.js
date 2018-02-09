/**
 * Server starting point.
 **/

// Requires
let express = require('express')
let path = require('path')
let favicon = require('serve-favicon')
let sslRedirect = require('heroku-ssl-redirect')

let app = express()

let login = require('./routes/login')
let port = process.env.PORT || 5151
let cwd = __dirname || process.cwd()
let staticPath = path.join(cwd, '../build')

require('dotenv').config({path: path.join(cwd + '/.env')})
require('./lib/auth/passport-setup').connect()

// Middlewares-------------------------------------------------------------------------------------------------------

// Enable ssl redirect.
app.use(sslRedirect())

// Serve favicon.
app.use(favicon(path.join(staticPath, '/assets/', 'favicon.ico')))

// Static react app.
app.use(express.static(staticPath))

// Routes----------------------------------------------------------------------------------------------------
app.use('/', login)

// Custom Error Responses-------------------------------------------------------------------------------------------------

// 400 >
app.use((req, res) => {
  res.status(302).redirect('/')
})

// 500
app.use((err, req, res, next) => {
  console.error(err)
  res.status(500).json({message: err.message})
})

// Start the server----------------------------------------------------------------------------------------------------
app.listen(port, () => {
  console.log('server up on port ' + port)
})
