/**
 * Module to provide client-side cookie-bases authorization.
 */

// Class --------------------------------------------------------------------------------------------------------------
class Notifications {
  /**
   * Checks if push is enabled in the browser and if a service worker is registred.
   */
  static checkPushSupport () {
    return new Promise((resolve, reject) => {
      if (!('PushManager' in window)) {
        resolve({success: false, message: 'Push notification isn\'t supported in your browser.'})
      }

      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.ready
        .then(() => {
          resolve({success: true})
        })
        .catch((error) => {
          reject(error.message || 'Service worket is not registred.')
        })
      }
    })
  }

  /**
   * Checks if user has blocked push notifications.
   */
  static checkPushPermission () {
    return new Promise((resolve, reject) => {
      if (Notification.permission === 'denied') {
        resolve({success: false, message: 'User has blocked push notifications.'})
      } else {
        resolve({success: true})
      }
    })
  }

  /**
   * CHeck whether user has enabled push notifications.
   */
  static getPushStatus () {
    return new Promise((resolve, reject) => {
      navigator.serviceWorker.ready
      .then((registration) => {
        return registration.pushManager.getSubscription()
      })
      .then((subscription) => {
        resolve({activated: subscription})
      })
      .catch((error) => {
        reject({message: error.message || 'Error enabling push notifications'})
      })
    })
  }

  /**
   * Subscribes the user to push notifications.
   */
  static subscribePush () {
    return new Promise((resolve, reject) => {
      navigator.serviceWorker.ready
      .then((registration) => {
        if (!registration.pushManager) {
          reject({message: 'Your browser doesn\'t support push notification.'})
        }

        return registration.pushManager.subscribe({
          userVisibleOnly: true
        })
      })
      .then((subscription) => {
        console.info('Push notification subscribed.')
        console.log(subscription)
        resolve()
        // saveSubscriptionID(subscription);
      })
      .catch((error) => {
        reject({message: 'Push notification subscription error: ' + error.message})
      })
    })
  }

  /**
   * Unsubscribes the user from push notifications.
   */
  static unsubscribePush () {
    return new Promise((resolve, reject) => {
      navigator.serviceWorker.ready
      .then((registration) => {
        return registration.pushManager.getSubscription()
      })
      .then((subscription) => {
        if(!subscription) {
          reject({message: 'Unable to unregister push notification.'})
        }

        return subscription.unsubscribe()
      })
      .then((subscription) => {
        console.info('Push notification unsubscribed.')
        console.log(subscription)
        //deleteSubscriptionID(subscription)
        resolve()
      })
      .catch((error) => {
        reject({message: error.message || 'Failed to unsubscribe push notification.'})
      })
    })
  }
}

// Exports ------------------------------------------------------------------------------------------------------------
export default Notifications
