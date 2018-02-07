/**
 * Front-end container, routes to the Welcome, About and Login-components.
 */

// Imports ------------------------------------------------------------------------------------------------------------
import React from 'react'
import { Link, Route, Switch } from 'react-router-dom'

import style from '../../ReactStyles'

import Welcome from '../../components/unauthorized/Welcome.jsx'
import LoginPage from './LoginPage.jsx'
import About from '../../components/unauthorized/About.jsx'

// Class --------------------------------------------------------------------------------------------------------------
/**
 * Routes the user and renders different components based on window location.
 */
const Container = ({ match }) => (
  <div className='unauthorized app-container'>
    <div className='App'>
      <header className='App-header'>
        <Link id='start-link' to='/'><h1 className='App-title'>Welcome to your Github Dash</h1></Link>
      </header>
    </div>
    <div className='main-space-front'>
      <Switch>
        <Route path='/login' render={(props) => (<LoginPage {...props} />)} />
      </Switch>
    </div>
  </div>
)

// Exports ------------------------------------------------------------------------------------------------------------
export default Container
