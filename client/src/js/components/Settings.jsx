import React, { Component } from 'react'

class Settings extends Component {
  render () {
    return (
      <div>
        {(this.props.name === 0) && (<h2>You are not following any organizations</h2>) }
        {(this.props.name !== 0) && (<h2>Offline notifications for {this.props.name}</h2>)}
      </div>
    )
  }
}

export default Settings
