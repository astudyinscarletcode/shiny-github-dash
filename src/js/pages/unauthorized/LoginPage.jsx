/**
 * Container-component that wraps the login button
 * Will render the button and pass down state as props.
 */

// Imports -------------------------------------------------------------------------------------------------------------
import React from 'react'
import axios from 'axios'
import auth from '../../modules/Auth'
import LoginButton from '../../components/unauthorized/LoginButton.jsx'

// Class --------------------------------------------------------------------------------------------------------------

/**
 * Container that controls the state of the Login Form
 * And sends the data to the server.
 * Renders a loading symbol or the form.
 */
class LoginPage extends React.Component {
      /**
     * Passes on props, binds methods and sets initial state.
     * @param props {Object} will be passed on.
     */
  constructor (props) {
    super(props)

    this.state = {
      errors: {},
      user: {
        email: '',
        password: '',
        passwordConfirm: ''
      },
      popup: false,
      popupAction: '',
      popupMessage: 'message has not been changed even though it should',
    }

    this.processLoginForm = this.processLoginForm.bind(this)
    this.processSignupForm = this.processSignupForm.bind(this)
  }

  /**
   * Sends the add login form-data to the server.
   * Redirects the user if successful in logging in.
   * Sets error state if something goes wrong.
   * @param event {Object} The event that fires when the form is submitted.
   */
  processLoginForm (event) {
    return new Promise((resolve, reject) => {
      event.preventDefault()

      axios.post('/login')
              .then((response) => {
                this.setState({
                  errors: {}
                })

                auth.authenticateUser(response.data.token, response.data.user.roles, response.data.user)
                if (this) this.props.history.push('/' + response.data.user.roles[0])
                resolve()
              })
              .catch((error) => {
                if (error.response && error.response.status === 404) {
                  this.setState({popup: true, popupAction: 'sign up', popupMessage: error.response.data.summary + ' Sign up user?'})
                } else {
                  const errors = error.response ? error.response.data.errors ? error.response.data.errors : error.response.data : {summary: 'you seem to be offline'}
                  this.setState({
                    errors: errors
                  })
                }
                resolve()
              })
    })
  }

  /**
   * Sends the add login form-data to the server if the passwords match.
   * Sets a popup-state to true asking the user to confirm the registration via email.
   * @param event {Object} The event that fires when the form is submitted.
   */
  processSignupForm (event) {
    return new Promise((resolve, reject) => {
      event.preventDefault()

      if (!(this.state.user.password === this.state.user.passwordConfirm)) {
        let errors = {
          password: 'passwords does not match',
          passwordConfirm: 'passwords does not match',
          summary: 'retype your passwords'
        }
        this.setState({errors: errors})

        resolve()
      } else {
        axios.post('/login/local/signup', {
          email: this.state.user.email,
          password: this.state.user.password,
          role: this.props.match.params.role
        })
                  .then((response) => {
                    this.setState({
                      errors: {},
                      popup: true,
                      popupAction: '',
                      popupMessage: response.data.summary,
                      signup: false
                    })

                    resolve()
                  })
                  .catch((error) => {
                    const errors = error.response ? error.response.data.errors ? error.response.data.errors : error.response.data : {summary: 'you seem to be offline'}
                    this.setState({
                      errors: errors
                    })

                    resolve()
                  })
      }
    })
  }
    /**
     * @returns {Component} a LoginButton
     */
  render () {
    return (
      <LoginButton className='login-page'
        onSubmit={this.processLoginForm}
        processSignup={this.processSignupForm}
        onChange={this.changeUser}
        onFacebookLogin={this.facebookLogin}
        errors={this.state.errors}
        user={this.state.user}
        allowFacebook={this.props.match.params.role === 'volunteer'}
        signup={this.state.signup}
        popup={this.state.popup}
        popupMessage={this.state.popupMessage}
        onPopupConfirm={this.changeToSignup}
        popupAction={this.state.popupAction}
      />
    )
  }
}

// Exports ------------------------------------------------------------------------------------------------------------
export default LoginPage
