/**
 * Starting point of the application.
 * Redirects the user to logged in screen if authenticated,
 * or renders the unauthenticated container component if not.
 * Renders the app into the HTML.
 * */

// Imports ------------------------------------------------------------------------------------------------------------
import React from 'react'
import ReactDOM from 'react-dom'
import { HashRouter } from 'react-router-dom'
import ScrollToTop from './components/ui-components/ScrollToTop.jsx'

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import darkBaseTheme from 'material-ui/styles/baseThemes/darkBaseTheme'
import getMuiTheme from 'material-ui/styles/getMuiTheme'

import App from './components/App.jsx'
import register from './register-service-worker'

// Config -------------------------------------------------------------------------------------------------------------
const muiTheme = getMuiTheme(darkBaseTheme)

// Render -------------------------------------------------------------------------------------------------------------
ReactDOM.render(
  <HashRouter >
    <MuiThemeProvider muiTheme={muiTheme}>
      <ScrollToTop>
        <App />
      </ScrollToTop>
    </MuiThemeProvider>
  </HashRouter>,
document.getElementById('root'))

// Service Worker--------------------------------------------------------------------------------------------------------
register()
