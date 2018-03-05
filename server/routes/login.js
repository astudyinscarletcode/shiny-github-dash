/**
 * Router for the gateway-pages.
 */

// Requires.
let router = require('express').Router()
let axios = require('axios')
let passport = require('passport')

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
            url: (process.env.GITHUB_APP_GATEWAY_URL + '/github/authorize'),
            method: 'POST',
            data: {user: user.username, accessToken: user.accessToken}
          })
          .then((result) => {
            return res.redirect('/?jwt=' + result.data)
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
