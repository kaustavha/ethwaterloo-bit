import React, { Component } from 'react'
const contract = require('truffle-contract')
import ISA from '../../../build/contracts/IdentityStorage.json'
class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    // authdata is all the obj we got from fb

    authData = this.props
    var address = window.web3.eth.accounts[0];
    this.state = {address: address, id: 0, privData:''};
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
    console.log(user);
    const address = this.state.address,
          name = user.name,
          email = user.email;
          // id "10155849841707360"
    console.log(address, name, email);

    var is = contract(ISA);
    is.setProvider(window.web3.currentProvider);
    // var IdStoreInstance = is.deployed();
    // console.log(IdStoreInstance);
    // window.ISA = IdStoreInstance;
    // var IdCreated = IdStoreInstance.IdCreated({fromBlock: "latest"});
    // IdCreated.watch((e,s)=>{console.log("EVENT!!!"); console.log(e,s);});
    // IdStoreInstance.createId(name,email,address,"FB","shh its a secret", {from: window.web3.eth.defaultAccount});
    var IdCreatedEvent;
      // IdCreatedEvent = IdStoreInstance.IdCreated();
      // IdCreatedEvent.watch((e,r)=>{console.log("EVE")});

    window.ISA = {};

    is.deployed().then((ISA) => {
      console.log(ISA);
      window.ISA = ISA;
      window.ISA.get = function(i, cb) {
        ISA.getAll(i, (s,a,m,l,la)=>{console.log(s,a,m,l,la)});
        ISA.getSocial(i, console.log);
        if (cb) cb();
      }
      IdCreatedEvent = ISA.IdCreated({fromBlock: "latest", from: window.web3.eth.defaultAccount});
      console.log(IdCreatedEvent);
      IdCreatedEvent.watch((e,r)=>{console.log("EVE")});

      return ISA.createId(name,email,address,"FB","shh its a secret", {from: window.web3.eth.defaultAccount});
    }).then(()=>{
      console.log("NEXT2");
      console.log(ISA);
      return window.ISA.find(name,email,address,"FB","shh its a secret", {from: window.web3.eth.defaultAccount});
    }).then((r,e)=>{
      console.log("NEXT3");
      console.log(r,e);
      return window.ISA.getAll(r);
    }).then((r,e) => {
      console.log("NEXT4");
      console.log(r);
      var component = 
        <table>
        <tr>
          for (var i in r) {
            <td>r[i]</td>
          }
          </tr>
        </table>
      
      console.log(component);
      console.log(e);
    });


    // is.deployed().then((instance) => {
    //   IdStoreInstance = instance;
    //   console.log('i');
    //   window.ISA = IdStoreInstance;
    //   var event = IdStoreInstance.IdCreated();
    //   event.watch((e,s)=>{console.log("EVENT!!!"); console.log(e,s);});
    //   return IdStoreInstance.createId(name,email,address,"FB","shh its a secret", {from: window.web3.eth.defaultAccount});
    // }).then(() => {
    //   console.log("e");
    //   console.log("succ");
    // });
    // window.ISA.createId.sendTransaction( "a","a",web3.eth.defaultAccount, 'a', 'a', { from: web3.eth.defaultAccount })
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
