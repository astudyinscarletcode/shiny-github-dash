/**
 * Module to provide client-side cookie-bases authorization.
 */

// Imports ------------------------------------------------------------------------------------------------------------
import Cookies from 'js-cookie'

// Class --------------------------------------------------------------------------------------------------------------
class Auth {
  /**
    * Save an authenticated user in a cookie.
    * @param {string} token - the users JWT token
    * @param {string} username - the username of the authenticated user
    */
  static authenticateUser (token, name) {
    Cookies.set('currentUser', {token: token, username: name}, {expires: 30})
  }

  /**
    * Check if a current user is saved.
    * @returns {boolean} true if the user is authenticated.
    */
  static isUserAuthenticated () {
    return Cookies.get('currentUser') !== undefined
  }

  /**
   * Remove the current users cookie session.
   */
  static deauthenticateUser () {
    Cookies.remove('currentUser')
    return true
  }

    /**
     * Get a token value from a cookie.
     * @returns {string} the token
     */
  static getToken () {
    if (Auth.isUserAuthenticated()) {
      return JSON.parse(Cookies.get('currentUser')).token
    } else {
      return undefined
    }
  }

  /**
     * Get user's name value from a cookie.
     * @returns {string} the name
     */
  static getName () {
    if (Auth.isUserAuthenticated()) {
      return JSON.parse(Cookies.get('currentUser')).username
    } else {
      return undefined
    }
  }
}

// Exports ------------------------------------------------------------------------------------------------------------
module.exports = Auth
