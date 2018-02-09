/**
 * Router for the gateway-pages.
 */

// Requires.
let router = require('express').Router()
let jwt = require('../lib/auth/jwt')
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
          return res.redirect('/?jwt=' + jwt.create({user: user.username, accessToken: user.accessToken}))
        }
      })(req, res, next)
    })

// Exports.
module.exports = router
