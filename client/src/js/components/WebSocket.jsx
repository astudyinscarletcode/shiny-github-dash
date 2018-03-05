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
    let newSocket = {
      name: this.props.organization,
      socket: socket(this.props.url, {
        query: 'organization=' + this.props.organization,
        transportOptions: {
          polling: {
            extraHeaders: {
              'Authorization': 'Bearer ' + this.props.auth
            }
          }
        }
      })
    }
    this.setState(prevState => ({
      sockets: [...prevState.sockets, newSocket]
    }))
  }

  componentWillReceiveProps (nextProps) {
    if (this.state.sockets.map((socket) => socket.name).indexOf(nextProps.organization) < 0) {
      let newSocket = {
        name: nextProps.organization,
        socket: socket(this.props.url, {
          query: 'organization=' + nextProps.organization,
          transportOptions: {
            polling: {
              extraHeaders: {
                'Authorization': 'Bearer ' + this.props.auth
              }
            }
          }
        })
      }
      this.setState(prevState => ({
        sockets: [...prevState.sockets, newSocket]
      }))
    }
  }

  render () {
    return (
      <div />
    )
  }
}

export default Websocket
