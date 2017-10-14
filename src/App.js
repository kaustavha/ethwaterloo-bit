import React, { Component } from 'react'
import { Link } from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'

// UI Components
import LoginButtonContainer from './user/ui/loginbutton/LoginButtonContainer'
import LogoutButtonContainer from './user/ui/logoutbutton/LogoutButtonContainer'

// Styles
import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

// const web3;

class App extends Component {
  constructor(props) {
    super(props);
    this.getInitialData = this.getInitialData.bind(this);
    this.getInitialData();
  }
  askForMetaMaskLogin(accs) {
    console.log(accs);
    alert("Please login to metaMask");
  }
  getInitialData() {
    var self = this;
    if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
    // Use Mist/MetaMask's provider
    const web3 = window.web3;
      console.log("Successfully connected to MetaMask")
      web3.setProvider(window.web3.currentProvider);

      web3.eth.getAccounts(function(err, accs){
        if (err){
          console.log ('error fetching accounts', err);
        } else {
          if (accs.length < 1) self.askForMetaMaskLogin(accs);
          self.setState({accounts: accs});
        }
      });
    }
  }
  render() {
    const OnlyAuthLinks = VisibleOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="/dashboard" className="pure-menu-link">Dashboard</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="/profile" className="pure-menu-link">Profile</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    const OnlyGuestLinks = HiddenOnlyAuth(() =>
      <span>
        <LoginButtonContainer />
      </span>
    )

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/" className="pure-menu-heading pure-menu-link">Truffle Box</Link>
          <ul className="pure-menu-list navbar-right">
            <OnlyGuestLinks />
            <OnlyAuthLinks />
          </ul>
        </nav>

        {this.props.children}
      </div>
    );
  }
}

export default App
