/**
 * A login-button component.
 */

// Imports ------------------------------------------------------------------------------------------------------------
import React from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Snackbar from 'material-ui/Snackbar'

// Class -------------------------------------------------------------------------------------------------------------

/**
 * Renders a login-button.
 * Can display a snackbar popup with optional action to communicate with the user.
 * Will display the error-state of the wrapper component.
 *
 * @param onSubmit {function} what to do when form is submitted.
 * @param onPopupConfirm {function} what to do when the popup is confirmed.
 * @param errors {Object} the error-state of the wrapper.
 * @param popup {Boolean} whether to display a popup.
 * @param popupAction {String} what action the popup button will have,
 * @param popupMessage {String} what message to display in the popuo.
 */
const LoginForm = ({
    onSubmit,
    onPopupConfirm,
    errors,
    popup,
    popupAction,
    popupMessage
}) => (
  <form className='login-form' action='/login' onSubmit={onSubmit}>

    {errors.summary && <p className='error-message'>{errors.summary}</p>}

    <div className='button-line'>
      <RaisedButton type='submit' label={'Sign in through Github'} primary />
    </div>

    <Snackbar
      className='popup'
      open={popup}
      message={popupMessage}
      action={popupAction}
      onActionTouchTap={onPopupConfirm}
    />
  </form>
)

// Exports -----------------------------------------------------------------------------------------------------------
export default LoginForm
