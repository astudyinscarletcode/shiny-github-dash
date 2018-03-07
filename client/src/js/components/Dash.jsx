import React from 'react'
import Websocket from './WebSocket.jsx'

import Auth from '../modules/auth'

const Dash = (name) => (
  <div>
    <h2>This is a dash page!</h2>
    {(name.name === 0) && <p>You are not the admin of any organizations</p> }
    {(name.name !== 0) && <p>{name.name}</p>}
    <Websocket
      url='ws://127.0.0.1:5050'
      auth={Auth.getToken()}
      organization={name.name}
      onMessage={(data) => { console.log(data) }}
    />
  </div>
)

export default Dash
