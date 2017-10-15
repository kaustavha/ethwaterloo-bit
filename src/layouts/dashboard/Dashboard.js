import React, { Component } from 'react'
const contract = require('truffle-contract')
import ISA from '../../../build/contracts/IdentityStorage.json'
class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    authData = this.props
    var address = window.web3.eth.accounts[0];
    this.state = {address: address, id: 0, privData:'', bit_profile: [], service_profile: {}};
    this.handleChange = this.handleChange.bind(this);
  }

  InitializeContract() {
      console.log("init contract");
      this.setState({IdentityStorage: contract(ISA)});
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
      console.log("NEXT"+window.nexti);
      window.a = a;
      window.b = b;
      console.log(a,b);
      window.nexti++;
    }

    is.deployed().then((ISA) => {
      window.ISA = ISA;
      return window.ISA.find(name,email,address,"FB","shh its a secret", {from: window.web3.eth.defaultAccount});
    }).then((r,e)=>{
      console.log("tried to find acc");
      window.exposeForDebug(r,e);
      if (!r) {
        return window.ISA.createId(name,email,address,"FB","shh its a secret", {from: window.web3.eth.defaultAccount});
      } else {
      return window.ISA.findId(name,email,address,"FB","shh its a secret", {from: window.web3.eth.defaultAccount});
      }
    }).then((r,e)=>{
      window.exposeForDebug(r,e);
      return window.ISA.getAll(r);
    }).then((r,e) => {
      window.exposeForDebug(r,e);
      self.setState({
        bit_profile: r
      });
    });
  }

  showBITProfile(){
      if (this.state.bit_profile !== undefined && this.state.bit_profile.length > 0){
        return (
          <table>
            <tr>
              <td>State:</td>
              <td>{this.state.bit_profile[0]}</td>
            </tr>
            <tr>
              <td>Associated Address:</td>
              <td>{this.state.bit_profile[1]}</td>
            </tr>
            <tr>
              <td>Money</td>
              <td>{this.state.bit_profile[2].toString()}</td>
            </tr>
            <tr>
              <td>Last Funder</td>
              <td>{this.state.bit_profile[3]}</td>
            </tr>
            <tr>
              <td>last Active</td>
              <td>{this.state.bit_profile[4].toString()}</td>
            </tr>
          </table>
        );
      }
  }

  handleChange(event) {
    this.setState({address: event.target.value});
  }
  render() {

    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Dashboard</h1>
            <p><strong>Congratulations {this.props.authData.name}!</strong> If you're seeing this page, you've logged in with Facebook successfully.</p>
            <button onClick={()=>this.storeOnChain(this.props.authData)}> Click here to upload your identitiy to the blockchain </button>
            <form>
              <label>
                Current Wallet Address: 
                <input type="text" name="address" value={this.state.address} onChange={this.handleChange}/>
              </label>
            </form>
            
          {this.showBITProfile()}
          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard
