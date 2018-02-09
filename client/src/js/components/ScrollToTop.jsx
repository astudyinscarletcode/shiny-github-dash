/**
 * A component to scroll to top on route-change.
 */

// Imports ------------------------------------------------------------------------------------------------------------
import { Component } from 'react'
import { withRouter } from 'react-router'

// Class --------------------------------------------------------------------------------------------------------------
class ScrollToTop extends Component {
  componentDidUpdate (prevProps) {
    if (this.props.location !== prevProps.location) {
      window.scrollTo(0, 0)
    }
  }

  render () {
    return this.props.children
  }
}

// Exports -----------------------------------------------------------------------------------------------------------
export default withRouter(ScrollToTop)
