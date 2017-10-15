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
      dispatch(loginUser(user))
    }
  }
}

const LoginButtonContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(LoginButton)

export default LoginButtonContainer
