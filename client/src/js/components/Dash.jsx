import React from 'react'
import Websocket from 'react-websocket'

const Dash = (name) => (
  <div>
    <h2>This is a dash page!</h2>
    <p>{name.name}</p>
    <Websocket url='ws://127.0.0.1//product/12345/'
      onMessage={(data) => { console.log(data) }} />
  </div>
)

export default Dash
