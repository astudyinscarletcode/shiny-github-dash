import React from 'react'
import socket from 'socket.io-client'

class Websocket extends React.Component {
  constructor (props) {
    super(props)

    this.state = {
      sockets: []
    }
  }

  componentDidMount () {
    if ((this.props.organization !== 0)) {
      this.addSocket(this.props.organization)
    }
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.sockets.map((socket) => socket.name).indexOf(nextProps.organization) < 0 && (nextProps.organization !== 0)) {
      this.addSocket(nextProps.organization)
    }
  }

  addSocket (organization) {
    let newSocket = {
      name: organization,
      socket: socket(this.props.url, {
        query: 'organization=' + organization,
        transportOptions: {
          polling: {
            extraHeaders: {
              'Authorization': 'Bearer ' + this.props.auth
            }
          }
        }
      })
    }

    newSocket.socket.on('event', this.props.onEvent)

    this.setState(prevState => ({
      sockets: [...prevState.sockets, newSocket]
    }))
  }

  render () {
    return (
      <div />
    )
  }
}

export default Websocket
