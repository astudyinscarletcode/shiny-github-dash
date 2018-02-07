/**
 * Container-component that wraps the login button
 * Will render the button and pass down state as props.
 */

// Imports -------------------------------------------------------------------------------------------------------------
import React from 'react'
import axios from 'axios'
import auth from '../../modules/auth'
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
      popup: false,
      popupAction: '',
      popupMessage: 'message has not been changed even though it should'
    }

    this.processLoginForm = this.processLoginForm.bind(this)
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

      axios.get('http://127.0.0.1:5252/login')
              .then((response) => {
                this.setState({
                  errors: {}
                })

                auth.authenticateUser(response.headers.Authorization, response.data.user)
                if (this) this.props.history.push('/dash')
                resolve()
              })
              .catch((error) => {
                const errors = error.response ? error.response.data.errors ? error.response.data.errors : error.response.data : {summary: 'you seem to be offline'}
                this.setState({
                  errors: errors
                })
                resolve()
              })
    })
  }

  /**
    * @returns {Component} a LoginButton
    */
  render () {
    return (
      <LoginButton className='login-page'
        onSubmit={this.processLoginForm}
        errors={this.state.errors}
        popup={this.state.popup}
        popupMessage={this.state.popupMessage}
        popupAction={this.state.popupAction}
      />
    )
  }
}

// Exports ------------------------------------------------------------------------------------------------------------
export default LoginPage
