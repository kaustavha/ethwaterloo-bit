import React, { Component } from 'react'
import { Link } from 'react-router'
import { HiddenOnlyAuth, VisibleOnlyAuth } from './util/wrappers.js'

// UI Components
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
    this.state = {
    	page_title: 'Dashboard',
    	metamask_msg: 'Waiting for MetaMask'
    };
    this.getInitialData = this.getInitialData.bind(this);
    this.getInitialData();
    this.togglePage = this.togglePage.bind(this);
    this.coming_soon = this.coming_soon.bind(this);
  }

  getInitialData() {
    var self = this;
    if (typeof window.web3 !== 'undefined' && typeof window.web3.currentProvider !== 'undefined') {
	    // Use Mist/MetaMask's provider
	    const web3 = window.web3;
      console.log("MetaMask successfully connected");
      web3.setProvider(window.web3.currentProvider);
      web3.eth.getAccounts(function(err, accs){
        if (err){
          console.log('MetaMask error fetching accounts', err);
          self.setState({
          	metamask_msg: 'Please reload page.'
          });
        } else {
          if (accs.length < 1){ // no accounts found
          	console.log('MetaMask found no account');
	          self.setState({
	          	metamask_msg: 'Please login to MetaMask.'
	          });
          }
          else{
          	console.log('MetaMask found ' + accs.length + ' account(s)');
         		console.log(accs);
	          self.setState({
	          	metamask_msg: 'MetaMask is Ready.'
	          });
          }
        }
      });
    }else{
      self.setState({
      	metamask_msg: 'Please run MetaMask.'
      });
    }
  }

  togglePage(){
		if (window.page_title === 'Dashboard'){
			window.page_title = 'Profile';
      this.setState({
        page_title: 'Profile'
      });
		}else{
			window.page_title = 'Dashboard';
      this.setState({
        page_title: 'Dashboard'
      });
		}
  }

	coming_soon(){
		alert('Coming Soon :)');
	}

  render() {
    const OnlyAuthLinks = VisibleOnlyAuth(() =>
      <span>
        <li className="pure-menu-item">
          <Link to="" className="pure-menu-link" onClick={this.togglePage}>Dashboard</Link>
        </li>
        <li className="pure-menu-item">
          <Link to="" className="pure-menu-link" onClick={this.togglePage}>Profile</Link>
        </li>
        <LogoutButtonContainer />
      </span>
    )

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
          <Link to="/" className="pure-menu-heading pure-menu-link">BIT (ETHWaterloo)</Link>
          <ul className="pure-menu-list navbar-right">
            <OnlyAuthLinks />
          </ul>
        </nav>

        {this.props.children}

      </div>
    );
  }
}

export default App
