import { uport } from './../../../util/connectors.js'
import { browserHistory } from 'react-router'

export const USER_LOGGED_IN = 'USER_LOGGED_IN'
function userLoggedIn(user) {
  return {
    type: USER_LOGGED_IN,
    payload: user
  }
}

export function loginUser(user) {

  // we have user data now lets store what we wanna store
  console.log('loginuser');
  // console.log(user);
  return function(dispatch) {
  dispatch(userLoggedIn(user));
      var currentLocation = browserHistory.getCurrentLocation()
      if ('redirect' in currentLocation.query)
      {
        return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
      }

      return browserHistory.push('/dashboard')
  }
  // return function(dispatch) {
  //   // UPort and its web3 instance are defined in ./../../../util/wrappers.
  //   // Request uPort persona of account passed via QR
  //   uport.requestCredentials().then((credentials) => {
  //     dispatch(userLoggedIn(credentials))

  //     // Used a manual redirect here as opposed to a wrapper.
  //     // This way, once logged in a user can still access the home page.
  //     var currentLocation = browserHistory.getCurrentLocation()

  //     if ('redirect' in currentLocation.query)
  //     {
  //       return browserHistory.push(decodeURIComponent(currentLocation.query.redirect))
  //     }

  //     return browserHistory.push('/dashboard')
  //   })
  // }
}
