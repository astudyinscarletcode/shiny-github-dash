/**
 * Server starting point.
 **/

// Requires
let express = require('express')
let path = require('path')
let favicon = require('serve-favicon')
var sslRedirect = require('heroku-ssl-redirect')

let app = express()

let port = process.env.PORT || 5151
let cwd = __dirname || process.cwd()
let staticPath = path.join(cwd, '/build')

// Middlewares-------------------------------------------------------------------------------------------------------

// Enable ssl redirect.
app.use(sslRedirect())

// Serve favicon.
app.use(favicon(path.join(staticPath, '/assets/', 'favicon.ico')))

// Find static resources.
app.use(express.static(staticPath))

// Start the server----------------------------------------------------------------------------------------------------
app.listen(port, () => {
  console.log('server up on port ' + port)
})
