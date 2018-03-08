import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Home from './Home.jsx'
import Container from './Container.jsx'

import Auth from '../modules/auth'

class Main extends Component {
  componentWillMount () {
    let jwt = new URL(location.href).searchParams.get('jwt')

    if (jwt) {
      Auth.authenticateUser(jwt)
      window.location = window.location.protocol + window.location.host + window.location.pathname + window.location.hash
    }
  }

  render () {
    return (
      <div>
        <Switch>
          <Route path='/dash' render={(props) => (Auth.isUserAuthenticated() ? (<Container {...props} />) : (<Redirect to={''} />))} />
          <Route path='/settings' render={(props) => (Auth.isUserAuthenticated() ? (<Container {...props} />) : (<Redirect to={''} />))} />
          <Route exact path='/' render={() => (Auth.isUserAuthenticated() ? (<Redirect to={'dash'} />) : (<Home />))} />
        </Switch>
      </div>
    )
  }
}

export default Main
