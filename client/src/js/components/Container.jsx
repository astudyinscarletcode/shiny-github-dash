import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

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
      menuOptions: []
    }

    this.handleToggle = this.handleToggle.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
    this.handleMessage = this.handleMessage.bind(this)
  }

  componentDidMount () {
    axios({
      method: 'get',
      headers: {'Authorization': 'Bearer ' + Auth.getToken()},
      url: 'http://127.0.0.1:5050/github/organizations'
    })
    .then((response) => {
      this.setState({menuOptions: response.data.organizations.map(org => org.login), selected: (response.data.organizations[0].login ? response.data.organizations[0].login : 0)})
    })
    .catch((err) => {
      console.log({message: err})
      console.log(err)
    })
  }

  handleToggle () {
    this.setState({open: !this.state.open})
  }

  handleSelect (key) {
    this.setState({selected: key})
  }

  handleMessage (message) {
    console.log(message)
    console.log(this.state[this.state.selected])

    if (!this.state[this.state.selected]) {
      console.log('no prev')
      this.setState({[this.state.selected]: {'messages': [message]}}, () => {console.log(this.state)})
    } else {
      console.log('prev')

      this.setState({
        [[this.state.selected].messages]: this.state[this.state.selected]['messages'].concat([message])
      }, () => {console.log(this.state)})
    }
  }

  render () {
    return (
      this.state.selected
      ? (<div>
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
            <Route path='/dash' render={(props) => (<Dash name={this.state.selected} onEvent={this.handleMessage} messages={this.state[this.state.selected] ? this.state[this.state.selected].messages : []} />)} />
            <Route path='/settings' render={(props) => (<Settings name={this.state.selected} />)} />
            <Route path={`${this.props.match.path}/logout`} render={() => (Auth.deauthenticateUser() ? (<Redirect to={'/'} />) : (<Redirect to={'dash'} />))} />
          </Switch>
        </div>
      </div>)
      : <CircularProgress />
    )
  }
}

export default Container
