import React, { Component } from 'react'
import { Switch, Route, Link } from 'react-router-dom'

import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import CircularProgress from 'material-ui/CircularProgress'
import axios from 'axios'

import Dash from './Dash.jsx'
import Settings from './Settings.jsx'

import Auth from '../modules/auth'

class Container extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      menuOptions: [],
      messages: {}
    }

    this.handleToggle = this.handleToggle.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
  }

  componentDidMount () {
    axios({
      method: 'get',
      headers: {'Authorization': 'Bearer ' + Auth.getToken()},
      url: 'https://46.101.84.10/github/organizations'
    })
    .then((response) => {
      this.setState({menuOptions: response.data.organizations.map(org => org.login), selected: (response.data.organizations[0] && response.data.organizations[0].login ? response.data.organizations[0].login : 1)})
    })
    .catch((err) => {
      console.log({message: err})
    })
  }

  handleToggle () {
    this.setState({open: !this.state.open})
  }

  handleSelect (key) {
    this.setState({selected: key})
  }

  handleMessage (message) {
    if (!this.state['messages'][this.state.selected]) {
      this.setState({messages: {[this.state.selected]: [message]}})
    } else {
      this.setState(prevState => ({
        messages: {
          [this.state.selected]: [...prevState.messages[this.state.selected], message]
        }
      }))
    }
  }

  render () {
    return (
      <div>
        <div className='navigation-bar'>
          <Link id='main-link' to='/'><img src='/assets/favicon.ico' /></Link>
          <div className='sub-nav'>
            <Link className='link' id='logout-link' to='/logout'>Logout</Link>
            <Link className='link' id='settings-link' to='/settings'>Settings</Link>
            <Link className='link' id='dash-link' to='/dash'>Dash</Link>
          </div>
        </div>
        {(this.state.selected) && (<div>
          <div>
            <RaisedButton
              label='Select Organization'
              onClick={this.handleToggle}
        />
            <Drawer open={this.state.open}>
              {(this.state.menuOptions.length === 0) && <p>You are not the admin of any organizations</p> }

              {(this.state.menuOptions.length > 0) && (
              <div>
                {this.state.menuOptions.map((option) => (
                  <MenuItem key={this.state.menuOptions.indexOf(option)} onClick={() => this.handleSelect(option)}>{option}</MenuItem>
                ))}
              </div>
            )}
            </Drawer>
          </div>
          <div>
            <Switch>
              <Route path='/dash' render={(props) => (<Dash name={this.state.selected} onEvent={this.handleMessage} messages={this.state.messages[this.state.selected] ? this.state.messages[this.state.selected] : []} />)} />
              <Route path='/settings' render={(props) => (<Settings name={this.state.selected} />)} />
            </Switch>
          </div>
        </div>)}
        {(!this.state.selected) && (<div className='wait'><CircularProgress /></div>)}
      </div>
    )
  }
}

export default Container
