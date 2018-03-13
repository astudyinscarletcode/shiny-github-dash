import React, { Component } from 'react'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActivateNotification from 'material-ui/svg-icons/alert/add-alert'
import UnActivateNotification from 'material-ui/svg-icons/navigation/cancel'
import RaisedButton from 'material-ui/RaisedButton'
import Toggle from 'material-ui/Toggle'
import Notifications from './../modules/notifications'
import Auth from '../modules/auth'
import axios from 'axios'
import https from 'https'

class Settings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pushPossible: false,
      pushEnabled: false,
      preferences: []
    }

    this.handlePushEnable = this.handlePushEnable.bind(this)
    this.onPrefToggle = this.onPrefToggle.bind(this)
    this.savePreferences = this.savePreferences.bind(this)
  }

  componentWillMount () {
    Notifications.checkPushSupport()
    .then((result) => {
      if (result.success) {
        this.setState({pushPossible: true})
      } else {
        this.setState({pushError: result.message})
      }

      return Notifications.checkPushPermission()
    })
    .then((result) => {
      if (!result.success) {
        this.setState({pushEnabled: false, pushError: result.message})
      }

      return Notifications.getPushStatus()
    })
    .then((result) => {
      if (result.activated) {
        this.setState({pushEnabled: true})
        return this.getPreferences()
      } else {
        this.setState({pushEnabled: false})
        return Promise.resolve([])
      }
    })
    .then((preferences) => {
      this.setState({preferences: preferences})
    })
    .catch((error) => {
      this.setState({pushError: error.message})
    })
  }

  handlePushEnable () {
    if (this.state.pushEnabled) {
      Notifications.unsubscribePush()
      .then((subscriptionID) => {
        return this.removeSubscriptionID(subscriptionID)
      })
      .then((result) => {
        this.setState({pushEnabled: false})
      })
      .catch((error) => {
        console.log('got error')
        console.log(error)
        this.setState({pushError: error.message})
      })
    } else {
      Notifications.subscribePush()
      .then((subscriptionID) => {
        return this.addSubscriptionID(subscriptionID)
      })
      .then(() => {
        this.setState({pushEnabled: true})
      })
      .catch((error) => {
        console.log('got error')
        console.log(error)
        this.setState({pushError: error.message})
      })
    }
  }

  addSubscriptionID (subscription) {
    axios({
      url: '/api/notifications/subscriptions/',
      method: 'PUT',
      headers: {'Authorization': 'Bearer ' + Auth.getToken()},
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      data: {
        subscription: subscription
      }
    })
  }

  removeSubscriptionID (subscription) {
    axios({
      url: '/api/notifications/subscriptions/',
      method: 'DELETE',
      headers: {'Authorization': 'Bearer ' + Auth.getToken()},
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      data: {
        subscription: subscription
      }
    })
  }

  savePreferences () {
    axios({
      url: '/api/notifications/preferences/' + this.props.name,
      method: 'PUT',
      headers: {'Authorization': 'Bearer ' + Auth.getToken()},
      httpsAgent: new https.Agent({
        rejectUnauthorized: false
      }),
      data: {
        preferences: this.state.preferences
      }
    })
  }

  onPrefToggle (isToggled, repo, eventType) {
    let preferences = this.state.preferences.find((prefs) => {
      return prefs.name === repo
    })

    let newPreferences = {name: repo, allowed: []}
    console.log(isToggled)

    if (isToggled) {
      newPreferences.allowed = preferences.allowed.indexOf(eventType) === -1 ? newPreferences.allowed.concat(preferences.allowed, [eventType]) : preferences.allowed
    } else {
      newPreferences.allowed = preferences.allowed.indexOf(eventType) === -1 ? preferences.allowed : preferences.allowed.filter((type) => { return type !== eventType })
    }

    console.log(newPreferences)

    this.setState({preferences: this.state.preferences.filter((pref) => {
      return pref.name !== repo
    })}, () => {
      this.setState(prevState => ({
        preferences: [...prevState.preferences, newPreferences]
      }))
    })
  }

  getPreferences () {
    return new Promise((resolve, reject) => {
      axios({
        url: '/api/notifications/preferences/' + this.props.name,
        method: 'GET',
        headers: {'Authorization': 'Bearer ' + Auth.getToken()},
        httpsAgent: new https.Agent({
          rejectUnauthorized: false
        })
      })
      .then((result) => {
        resolve(result.data.preferences)
      })
      .catch((error) => {
        reject(error)
      })
    })
  }

  render () {
    return (
      <div>
        <div>
          {(this.props.name === 1) && (<h2>You are not following any organizations</h2>) }
          {(this.props.name !== 1) && (<h2>Offline notifications for {this.props.name}</h2>)}
        </div>
        {(this.props.name !== 1) &&
        (<div>
          <div>
          {(this.state.preferences.length === 0) && (<p>No repositories found in this organization.</p>)}
            {(this.state.preferences.length > 0) && (this.state.preferences.map((preference, index) => {
              return (
                <div className='toggles' key={index}>
                  <h3>{preference.name}</h3>
                  <Toggle
                    label='Commit events'
                    onToggle={(event, isToggled) => { this.onPrefToggle(isToggled, preference.name, 'push') }}
                    toggled={preference.allowed.indexOf('push') > -1}
                    labelStyle={{color: 'black'}}
                />
                  <Toggle
                    label='Repository events'
                    onToggle={(event, isToggled) => { this.onPrefToggle(isToggled, preference.name, 'repo') }}
                    toggled={preference.allowed.indexOf('repo') > -1}
                    labelStyle={{color: 'black'}}
                />
                  <Toggle
                    label='Release events'
                    onToggle={(event, isToggled) => { this.onPrefToggle(isToggled, preference.name, 'release') }}
                    toggled={preference.allowed.indexOf('release') > -1}
                    labelStyle={{color: 'black'}}
                />
                </div>
              )
            }))}
            <RaisedButton label='Save notification preferences' onClick={this.savePreferences} />
          </div>
          <div className='action-button-div'>
            {(this.state.pushError) && <p>{this.state.pushError}</p>}
            <div className='action-button'>
              <p>Activate offline notifications:</p>
              <FloatingActionButton onClick={this.handlePushEnable} disabled={!this.state.pushPossible}>
                {(!this.state.pushEnabled) && <ActivateNotification />}
                {(this.state.pushEnabled) && <UnActivateNotification />}
              </FloatingActionButton>
            </div>
          </div>
        </div>)}
      </div>
    )
  }
}

export default Settings
