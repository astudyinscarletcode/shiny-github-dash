/*
* Container-component that wraps the authorized-components.
* Renders different component based on authorization and
* window location.
*/

// Imports--------------------------------------------------------------------------------------------------------------
import { React, Component } from 'react'
import { Route, Redirect, Switch, Link } from 'react-router-dom'

import Auth from '../../modules/auth'

import UnauthorizedContainer from '../unauthorized/UnauthorizedContainer.jsx'
import DashPage from './DashPage.jsx'

// Class --------------------------------------------------------------------------------------------------------------

/**
 * Routes the user and renders different components based on window location.
 */
class AuthorizedContainer extends Component {
    /**
     * Constructor gets the user-roles for the currently authorized user.
     * @param props {Object} gets passed on to the super-constructor.
     */
  constructor (props) {
    super(props)

    this.state = {
      isAuthorized: true,
      user: {}
    }

    this.state.isAuthorized = Auth.isAuthorized()
    this.state.user = Auth.getUserName()
  }

    /**
     * Will render either theauthorized-pages or the front end-container.
     * @returns {Component} Different components depending on if the user is authorized.
     */
  render () {
    return this.state.isAuthorized ? (
      <div className='authorized-app app-container'>
        <div className='app-bar'>
          {this.state.user}
          <Link id='logout-link' to={`${this.props.match.path}/logout`}>LOG OUT</Link>
        </div>
        <div className='main-space'>
          <Switch>
            <Route path={`${this.props.match.path}/dash`} render={(props) => (<DashPage {...props} />)} />
            <Route path={`${this.props.match.path}/logout`} render={() => (Auth.deauthenticateUser() ? (<Redirect to={'/'} />) : (<Redirect to={`${this.props.match.path}/dash`} />))} />
            <Redirect path={`${this.props.match.path}/`} to={`${this.props.match.path}/dash`} />
          </Switch>
        </div>
      </div>
            ) : (<UnauthorizedContainer />)
  }
}

// Exports ------------------------------------------------------------------------------------------------------------
export default AuthorizedContainer
