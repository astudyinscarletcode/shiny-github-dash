/**
 * Starting point of the application.
 * Redirects the user to logged in screen if authenticated,
 * or renders the unauthenticated container component if not.
 * Renders the app into the HTML.
 * */

// Imports ------------------------------------------------------------------------------------------------------------
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter, Route, Switch, Redirect } from 'react-router-dom'
import ScrollToTop from './components/ScrollToTop.jsx'
import injectTapEventPlugin from 'react-tap-event-plugin'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import Auth from './modules/auth'
import '../css/style.css'

import UnauthorizedContainer from './containers/unauthorized/UnauthorizedContainer.jsx'
import AuthorizedContainer from './containers/authorized/AuthorizedContainer.jsx'

// Config -------------------------------------------------------------------------------------------------------------
injectTapEventPlugin()

const muiTheme = getMuiTheme(darkBaseTheme)

// Class --------------------------------------------------------------------------------------------------------------
const App = () => (
  <HashRouter >
    <MuiThemeProvider muiTheme={muiTheme}>
      <ScrollToTop>
        <div>
          <Switch>
            <Route path='/dash' render={(props) => (Auth.isUserAuthenticated() ? (<AuthorizedContainer {...props} />) : (<UnauthorizedContainer />))} />
            <Route path='/' render={() => (Auth.isUserAuthenticated() ? (<Redirect to={'dash'} />) : (<UnauthorizedContainer />))} />
          </Switch>
        </div>
      </ScrollToTop>
    </MuiThemeProvider>
  </HashRouter>
)

// Render -------------------------------------------------------------------------------------------------------------
ReactDOM.render(<App />, document.getElementById('root'))
