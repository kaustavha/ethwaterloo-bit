import React from 'react'
// FB
import FacebookLogin from 'react-facebook-login';



 const LoginButton = ({ onLoginUserClick }) => {
 	const responseFacebook = (response) => {
 		console.log(response);
 		console.log("aaaaaaaaaaaaaa")
 		console.log(this.state);
 		// dispatch(userLoggedIn(response))
 	}
    return (
      <FacebookLogin
        appId="1496742003751714"
        autoLoad={false}
        fields="name,email,picture"
        scope="public_profile,user_friends,user_actions.books"
        callback={onLoginUserClick}
      />
    )
  }


// // Images
// import uPortLogo from '../../../img/uport-logo.svg'

// const LoginButton = ({ onLoginUserClick }) => {
//   return(
//     <li className="pure-menu-item">
//       <a href="#" className="pure-menu-link" onClick={(event) => onLoginUserClick(event)}><img className="uport-logo" src={uPortLogo} alt="UPort Logo" />Login with UPort</a>
//     </li>
//   )
// }

export default LoginButton
