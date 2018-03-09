import React, { Component } from 'react'
import FloatingActionButton from 'material-ui/FloatingActionButton'
import ActivateNotification from 'material-ui/svg-icons/alert/add-alert'
import UnActivateNotification from 'material-ui/svg-icons/navigation/cancel'
import Notifications from './../modules/notifications'

class Settings extends Component {
  constructor (props) {
    super(props)
    this.state = {
      pushPossible: false,
      pushEnabled: false
    }

    this.handlePushEnable = this.handlePushEnable.bind(this)
  }

  componentWillMount () {
    Notifications.checkPushSupport()
    .then((result) => {
      if (result.success) {
        this.setState({pushPossible: true})
      } else {
        this.setState({pushError: result.message})
      }

      return Notifications.checkPushPermisson()
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
      } else {
        this.setState({pushEnabled: false})
      }
    })
    .catch((error) => {
      this.setState({pushError: error.message})
    })
  }

  handlePushEnable () {
    console.log('clickety')
    if (this.state.pushEnabled) {
      Notifications.unsubscribePush()
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
      .then((result) => {
        this.setState({pushEnabled: true})
      })
      .catch((error) => {
        console.log('got error')
        console.log(error)
        this.setState({pushError: error.message})
      })
    }
  }

  render () {
    return (
      <div>
        <div>
          {(this.props.name === 0) && (<h2>You are not following any organizations</h2>) }
          {(this.props.name !== 0) && (<h2>Offline notifications for {this.props.name}</h2>)}
        </div>
        <div className='action-button-div'>
          {(this.state.pushError) && <p>{this.state.pushError}</p>}
          <div className='action-button'>
            <FloatingActionButton onClick={this.handlePushEnable} disabled={!this.state.pushPossible}>
              {(!this.state.pushEnabled) && <ActivateNotification />}
              {(this.state.pushEnabled) && <UnActivateNotification />}
            </FloatingActionButton>
          </div>
        </div>
      </div>
    )
  }
}

export default Settings
