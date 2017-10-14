import React, { Component } from 'react'
const contract = require('truffle-contract')
import ISA from '../../../build/contracts/IdentityStorage.json'
class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    // authdata is all the obj we got from fb

    authData = this.props
    var address = window.web3.eth.accounts[0];
    this.state = {address: address};
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
    if (this.state.address.length < 1) {
      this.checkMetaMask();
    }
    const address = this.state.address,
          name = user.name,
          email = user.email;
    
    console.log(address, name, email);
    var is = contract(ISA);
    is.setProvider(window.web3.currentProvider);
    var IdStoreInstance;
    is.deployed().then((instance) => {
      IdStoreInstance = instance;
      console.log('i');
      return IdStoreInstance.set.call(name,email,address);
    }).then(() => {
      console.log("e");
      console.log("succ");
    });
    // console.log(is);
    // console.log(this.props.authData.name,
    //   this.props.authData.email,
    //   this.state.address)
    // //nea
    // is.set(
    //   this.state.authData.name,
    //   this.state.authData.email,
    //   this.state.address, (err, succ) => {
    //     console.log(err);
    //     console.log(succ);
    //   });
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
