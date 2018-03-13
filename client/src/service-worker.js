/**
 * A very simple ServiceWorker that listens for push notifications.
 */

 /**
   * Listen for push-notifications.
   */
  self.addEventListener('push', (event) => {
    console.info('Event: Push')
    console.log(JSON.parse(event.data.text()))
    let payload = JSON.parse(event.data.text()) || 'no payload'
    event.waitUntil(
      self.registration.showNotification('Shiny Github Dash', {
        body: payload.user + ' did a ' + payload.type + ' in the ' + payload.repo + ' repo of the ' + payload.organization + ' organization.'
      })
    )
  })
