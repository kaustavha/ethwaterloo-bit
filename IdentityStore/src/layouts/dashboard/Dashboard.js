import React, { Component } from 'react'
const contract = require('truffle-contract')
import ISA from '../../../build/contracts/IdentityStorage.json'
class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    var address = window.web3.eth.accounts[0];
    this.state = {address: address, id: 0, privData:'', bit_profile: [], service_profile: [], page_title: 'Dashboard', returnUrl: false};
    this.handleChange = this.handleChange.bind(this);    
    this.togglePage = this.togglePage.bind(this);
  }

  InitializeContract() {
		console.log("init contract");
		this.setState({IdentityStorage: contract(ISA)});

    var is = contract(ISA);
    is.setProvider(window.web3.currentProvider);
    is.deployed();
  }

  checkMetaMask(cb) {
    window.web3.eth.getAccounts((err, acc) => {
      if (err) console.log(err);
      if (acc.length < 1) {
        alert("Please Login to metamask or manually provide a wallet address to associate with your account");
      } else {
        this.setState({address: acc[0]});
        // this.state.address = acc[0];
      }
      if (cb) cb();
    });
  }
  storeOnChain(user) {
    var self = this;
    if (this.state.address.length < 1) {
      this.checkMetaMask();
    }
    console.log(user);
    const address = this.state.address,
          name = user.name,
          email = user.email;
          // id "10155849841707360"
    console.log(address, name, email);

    var is = contract(ISA);
    is.setProvider(window.web3.currentProvider);
    var IdCreatedEvent;

    window.ISA = {};

    window.nexti = 0;
    window.exposeForDebug = function(a,b) {
      console.log("NEXT " + window.nexti);
      window.a = a;
      window.b = b;
      console.log(a,b);
      window.nexti++;
    }

    // if (window.returl) {
    //   if (window.returl)
    // this.setState({returnUrl: window.returl});
    // }

    is.deployed().then((ISA) => {
      window.ISA = ISA;
      return window.ISA.find(name,email,address,"FB","shh its a secret", {from: window.web3.eth.defaultAccount});
    }).then((r,e)=>{
      window.exposeForDebug(r,e);
      if (!r) {
				console.log("Tried to find account");
        return window.ISA.createId(name,email,address,"FB","shh its a secret", {from: window.web3.eth.defaultAccount});
      } else {
        return window.ISA.findId(name,email,address,"FB","shh its a secret", {from: window.web3.eth.defaultAccount});
      }
    }).then((user_id,e)=>{
      user_id = parseInt(user_id);
      window.exposeForDebug(user_id,e);
      if (window.returl !== undefined) {
        if (window.returl.length > 0) window.location.assign("http://localhost:3001");
      }
      // if (this.state.returnUrl) {
      //   window.location.assign(this.state.returnUrl);
      //   return;
      // }
      self.user_id = user_id;
      return window.ISA.getSocial(user_id);
    }).then((service_profile,e) => {
      window.exposeForDebug(service_profile,e);
      self.setState({
        service_profile: service_profile
      });
      return window.ISA.getAll(self.user_id);
    }).then((bit_profile,e) => {
      window.exposeForDebug(bit_profile,e);
      self.setState({
        bit_profile: bit_profile
      });
    });

  }

	showPageInfo(){
		if (this.state.page_title === 'Dashboard'){
    	return <div id="service_profile">
      	<h3>Service Provider Profile</h3>
      	{this.showServiceProfile()}
    	</div>
		}else{
    	return <div id="bit_profile">
      	<h3>BIT Profile</h3>
      	{this.showBITProfile()}
			</div>
		}
	}

	showBITProfile(){
		if (this.state.bit_profile !== undefined && this.state.bit_profile.length > 0){
		  return (
		    <table className="boldkey">
		    	<tbody>
		        <tr>
		          <td>State:</td>
		          <td>{this.state.bit_profile[0]}</td>
		        </tr>
		        <tr>
		          <td>Associated Address:</td>
		          <td>{this.state.bit_profile[1]}</td>
		        </tr>
		        <tr>
		          <td>Money:</td>
		          <td>{this.state.bit_profile[2].toString()}</td>
		        </tr>
		        <tr>
		          <td>Last Funder:</td>
		          <td>{this.state.bit_profile[3]}</td>
		        </tr>
		        <tr>
		          <td>Last Active:</td>
		          <td>{this.state.bit_profile[4].toString()}</td>
		        </tr>
		    	</tbody>
		    </table>
		  );
		}
	}

	showServiceProfile(){
		if (this.state.service_profile !== undefined && Object.keys(this.state.service_profile).length > 0){
			var service_profile = this.state.service_profile;
		  return (
		    <table className="boldkey">
		    	<tbody>
		        <tr>
		          <td>Name:</td>
		          <td>{service_profile[0]}</td>
		        </tr>
		        <tr>
		          <td>Email:</td>
		          <td>{service_profile[1]}</td>
		        </tr>
		        <tr>
		          <td>Identity Provider:</td>
		          <td>{service_profile[2]}</td>
		        </tr>
		    	</tbody>
		    </table>
		  );
		}
	}

  handleChange(event) {
    this.setState({address: event.target.value});
  }

  togglePage(){
		if (this.state.page_title === 'Dashboard'){
      this.setState({
        page_title: 'Profile'
      });
		}else{
      this.setState({
        page_title: 'Dashboard'
      });
		}
  }

  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
          	<button onClick={this.togglePage}>Toggle Page</button>

            <h1 id="page_title">{this.state.page_title}</h1>
            <p><strong>Congratulations {this.props.authData.name}!</strong> If you're seeing this page, you've logged in with Facebook successfully.</p>
            <button onClick={()=>this.storeOnChain(this.props.authData)}> Click here to upload your identitiy to the blockchain </button>
            <form>
              <h3>Current Wallet Address</h3>
              <input type="text" name="address" value={this.state.address} size="47" onChange={this.handleChange}/>
            </form>

						{this.showPageInfo()}

          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard
