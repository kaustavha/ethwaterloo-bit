import React, { Component } from 'react'
const contract = require('truffle-contract')

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    // authdata is all the obj we got from fb

    authData = this.props
    var address = window.web3.eth.accounts[0];
    this.state = {address: address, IdentityStorage: {}};
    this.handleChange = this.handleChange.bind(this);
    var jq = window.$;
  }

  InitializeContract() {
    this.jq.getJSON("IdentityStorage.json", (data) => {
      var ISA = data;
      this.setState({IdentityStorage: contract(ISA)});
      // App.contracts.Adoption.setProvider(App.web3Provider);
      // App.contracts.IdentityStorage = TruffleContract(ISA);
    });
  }

  checkMetaMask(cb) {
    window.web3.eth.getAccounts((err, acc) => {
      if (err) console.log(err);
      if (acc.length < 1) {
        alert("Please Login to metamask or manually provide a wallet address to associate with your account");
      } else {
        this.state.address = acc[0];
      }
      if (cb) cb();
    });
  }
  storeOnChain(user) {
    if (this.state.address.length < 1) {
      this.checkMetaMask();
    }
    
    // e.preventDefault();
    console.log(this.state.address)
    console.log(user);
    console.log("store on chain");
    console.log(this.web3);
    // console.log(this.state.accounts);
    console.log(window.web3);
    // console.log(this.props.authData);
    this.InitializeContract();
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
          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard
