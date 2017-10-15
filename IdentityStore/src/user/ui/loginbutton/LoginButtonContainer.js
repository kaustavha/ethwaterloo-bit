import { connect } from 'react-redux'
import LoginButton from './LoginButton'
import { loginUser } from './LoginButtonActions'
// import LoginComponent from './LoginComponent'
const mapStateToProps = (state, ownProps) => {
  return {}
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLoginUserClick: (user) => {
    	// if we need to redirec thold onto it
    	if (window.location.search) {
    		var a = window.location.search;
    		a = a.substring(a.indexOf('=')+1, a.length);
    		if (a.indexOf("localhost:3001") > -1) window.returl = a;
    	}
      dispatch(loginUser(user))
    }
  }
}

const LoginButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginButton)

export default LoginButtonContainer
