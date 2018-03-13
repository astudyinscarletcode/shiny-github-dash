/**
 * Router for the gateway-pages.
 */

// Requires.
let router = require('express').Router()
let axios = require('axios')
let passport = require('passport')
let https = require('https')

/**
 * Authenticate the user through github, request scopes.
 */
router.route('/login')
    .get(passport.authenticate('github', {scope: ['user', 'repo', 'admin:org_hook', 'admin:org']}))

/**
 * Handle the authentication.
 */
router.route('/login/return')
    .get((req, res, next) => {
      passport.authenticate('github', (err, user) => {
        if (err) {
          return next(err)
        } else {
          axios({
            url: ('https://188.166.170.11/github/authorize'),
            method: 'POST',
            httpsAgent: new https.Agent({
              rejectUnauthorized: false
            }),
            data: {user: user.username, accessToken: user.accessToken}
          })
          .then((result) => {
            return res.redirect('/?jwt=' + result.data.token)
          })
          .catch((err) => {
            console.log(err)
            return res.sendStatus(500)
          })
        }
      })(req, res, next)
    })

// Exports.
module.exports = router
