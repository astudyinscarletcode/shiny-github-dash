import React, { Component } from 'react'
import axios from 'axios'
import '../css/app.css'

class App extends Component {
  constructor (props) {
    super(props)

    this.state = {
      response: null,
      errors: {}
    }
  }

  componentWillMount () {
    axios({
      method: 'GET',
      url: 'http://18.219.12.175/user-service'
    })
          .then((response) => {
            console.log(response)
            this.setState({
              response: response.data.message
            })
          })
          .catch((error) => {
            this.state.errors = error.response ? error.response.data.errors ? error.response.data.errors : error.response.data : {summary: 'are you offline?'}
            console.log(this.state.errors)
          })
  }

  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>Welcome to your Github Dash</h1>
        </header>
        <p className='App-intro'>
          Updates will be here.
        </p>
        <p>
          Talking to the server:
          {this.state.response}
        </p>
        <p>
          Errors:
          {this.state.errors}
        </p>
      </div>
    )
  }
}

export default App
