import React, { Component } from 'react'
import '../../css/app.css'
import Main from './Main.jsx'

class App extends Component {
  render () {
    return (
      <div className='App'>
        <header className='App-header'>
          <h1 className='App-title'>Github Dash</h1>
        </header>
        <div className='App-intro'>
          <Main />
        </div>
      </div>
    )
  }
}

export default App
