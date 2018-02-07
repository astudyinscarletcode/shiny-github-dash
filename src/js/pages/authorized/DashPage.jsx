/**
 * Container component that controls the display of the matches between the user's preferences
 * and their needs.
 */

// Imports ------------------------------------------------------------------------------------------------------------
import React from 'react'

import CircularProgress from 'material-ui/CircularProgress'
import Snackbar from 'material-ui/Snackbar'
import OrganizationList from '../../components/authorized/OrganizationList.jsx'
import Auth from '../../modules/auth'
import axios from 'axios'

// Variables--------------------------------------------------------------------------------------------------------------
let noNeedsText = "you don't seem to be a member of any organizations."
let serverErrorMessage = 'we seem to not be getting a response.'

// Class---------------------------------------------------------------------------------------------------------------

/**
 * Controls the state of the list of organizations
 * and communicates with the server.
 */
class DashPage extends React.Component {
    /**
     * Passes on props, binds methods and sets initial state.
     * @param props {Object} will be passed on.
     */
  constructor (props) {
    super(props)

    this.state = {
      organizations: null,
      offlinePopup: false,
      errors: {}
    }
  }

    /**
     * Makes a call to the server to get the current organizations for the logged in user.
     * If no response from server within five seconds, sets offline popup
     * to true.
     */
  componentWillMount () {
    let responseTimeout = setTimeout(() => {
      this.setState({offlinePopup: true})
    }, 5000)

    axios({
      method: 'GET',
      url: '/dash',
      headers: {'Authorization': `bearer ${Auth.getToken()}`}
    })
    .then((response) => {
      clearTimeout(responseTimeout)

      this.setState({
        offlinePopup: false,
        organizations: response.data
      })
    })
    .catch((error) => {
      this.state.errors = error.response ? error.response.data.errors ? error.response.data.errors : error.response.data : {summary: 'are you offline?'}
    })
  }
    /**
     * Renders the list when the match information has been received from the server
     * and a loading symbol with a potential offline popup for user communication
     * until then.
     * @returns {Component} A NeedsList with an action that lets you apply for matches.
     * or a CircularProgress Component.
     */
  render () {
    return (
            this.state.organizations ? (
              <OrganizationList
                needs={this.state.needs}
                errors={this.state.errors}
                noNeedsText={noNeedsText}
                    />) : (
                      <div>
                        <CircularProgress />
                        <Snackbar
                          message={serverErrorMessage + this.state.errors.summary}
                          open={this.state.offlinePopup}
                        />
                      </div>
                )
    )
  }
}

// Exports--------------------------------------------------------------------------------------------------------------
export default DashPage
