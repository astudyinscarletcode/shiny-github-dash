import React, { Component } from 'react'
import Websocket from './WebSocket.jsx'

import Auth from '../modules/auth'

class Dash extends Component {
  constructor (props) {
    super(props)
    console.log(this.props.messages.length)
  }

  render () {
    return (
      <div>
        <h2>This is a dash page!</h2>
        {(this.props.name === 0) && (<p>You are not the admin of any organizations</p>) }
        {(this.props.name !== 0) && (<p>{this.props.name}</p>)}
        {(this.props.messages.length > 0) && (this.props.messages.map((event) => { return (<div><p>{event.time}</p><p>{event.user} did a {event.type} in {event.repo}</p></div>) }))}
        <Websocket
          url='ws://127.0.0.1:5050'
          auth={Auth.getToken()}
          organization={this.props.name}
          onEvent={this.props.onEvent}
    />
      </div>
    )
  }
}

export default Dash
