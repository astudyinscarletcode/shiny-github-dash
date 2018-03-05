import React, { Component } from 'react'
import { Switch, Route, Redirect } from 'react-router-dom'

import Drawer from 'material-ui/Drawer'
import MenuItem from 'material-ui/MenuItem'
import RaisedButton from 'material-ui/RaisedButton'
import axios from 'axios'

import Dash from './Dash.jsx'
import Settings from './Settings.jsx'

import Auth from '../modules/auth'

class OrganizationPicker extends Component {
  constructor (props) {
    super(props)
    this.state = {
      open: false,
      menuOptions: [],
      selected: 0
    }

    this.handleToggle = this.handleToggle.bind(this)
    this.handleSelect = this.handleSelect.bind(this)
  }

  componentDidMount () {
    axios({
      method: 'get',
      headers: {'Authorization': 'Bearer ' + Auth.getToken()},
      url: 'http://127.0.0.1:5050/github/organizations'
    })
    .then((response) => {
      this.setState({menuOptions: response.data.map(org => org.login)})
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

  render () {
    return (
      <div>
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
                  <MenuItem key={this.state.menuOptions.indexOf(option)} onClick={() => this.handleSelect(this.state.menuOptions.indexOf(option))}>{option}</MenuItem>
                ))}
            </div>
            )}
          </Drawer>
        </div>
        <div>
          <Switch>
            <Route path='/dash' render={(props) => (<Dash name={this.state.selected} />)} />
            <Route path='/settings' render={(props) => (<Settings name={this.state.selected} />)} />
            <Route path={`${this.props.match.path}/logout`} render={() => (Auth.deauthenticateUser() ? (<Redirect to={'/'} />) : (<Redirect to={'dash'} />))} />
          </Switch>
        </div>
      </div>
    )
  }
}

export default OrganizationPicker
