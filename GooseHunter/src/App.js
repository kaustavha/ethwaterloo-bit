import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
// import getWeb3 from './utils/getWeb3'
import IdentityStorageContract from '../build/contracts/IdentityStorage.json'
const contract = require('truffle-contract');
// const ISA = contract(IdentityStorageContract);
// const address = window.web3.eth.defaultAccount;
import ghjson from '../build/contracts/GooseHunter.json'


// Goosehunter bounties
// import ghb from '../../StandardBounties/build/contracts/StandardBounties.json'
// window.ISA = ISA;

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)

  // window.ISA.setProvider(window.web3.currentProvider);
    this.state = {
      money: 0,
      web3: window.web3,
      profile: "",
      updated: false
    }
    this.auth = this.auth.bind(this);
  }

  // componentWillMount() {
  //   // Get network provider and web3 instance.
  //   // See utils/getWeb3 for more info.

  //   // getWeb3
  //   // .then(results => {
  //   //   this.setState({
  //   //     web3: results.web3
  //   //   })

  //     // Instantiate contract once web3 provided.
  //     // this.instantiateContract()
  //   })
  //   .catch(() => {
  //     console.log('Error finding web3.')
  //   })
  // }

  instantiateContract() {
    /*
     * SMART CONTRACT EXAMPLE
     *
     * Normally these functions would be called in the context of a
     * state management library, but for convenience I've placed them here.
     */

    const contract = require('truffle-contract')
    const simpleStorage = contract(SimpleStorageContract)
    simpleStorage.setProvider(this.state.web3.currentProvider)

    // Declaring this for later so we can chain functions on SimpleStorage.
    var simpleStorageInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      simpleStorage.deployed().then((instance) => {
        simpleStorageInstance = instance
        // Stores a given value, 5 by default.
        return simpleStorageInstance.set(5, {from: accounts[0]})
      }).then((result) => {
        // Get the value from the contract to prove it worked.
        return simpleStorageInstance.get.call(accounts[0])
      }).then((result) => {
        // Update state with the result.
        return this.setState({ storageValue: result.c[0] })
      });
    });
  }

  showMoney() {
    if (this.state.updated) {
      return (<p> You have: $Eth {this.state.money} </p>);
    }
  }

  showChirp(){
    if (this.state.updated) {
      if (this.state.money == 0) {
        return (
          <div>
          <p>Wow youre broke :,( </p>
          <p>Lets enter you into the Lottereth</p>
          <p> And lets get you a job as a Goose Hunter</p>
          <button onClick={()=>this.GooseHunterBounty()}>Accept Job offer</button>
          </div>
          );
      } else {
        return (<p>Hey youre rich, can I have some?</p>);
      }
    }
  }

  showProfile(){
    if (this.state.profile !== undefined && this.state.profile.name !== undefined){
      return (
        <p>Hi there {this.state.profile.name}</p>
        // <p> Would you like to meet our lord and saviour 
        );
    }
  }

  GooseHunterBounty() {
    console.log("TODO");
  }


  redirectForCreds(cb) {
    alert("Hey looks like you dont have an acc, we'll redirect you to our login provider");
    alert(window.location.host);
    // alert(window.ISA.currentUrl);
    // window.ISA.setReturnPath(window.location.host).then((e,r)=>{
    //   alert(e);
    //   alert(r);
    // });
    // alert(window.ISA.currentUrl((e,r)=>{
    //   console.log(e,r);
    // }));
    // window.ISA.currentUrl().then((r,e)=>{
    //   console.log(r,e);
    // });
    window.location.assign("http://localhost:3000"+"?returl="+window.location.host);
  }

  auth() {
    window.nexti = 0;
    window.exposeForDebug = function(a,b) {
      console.log("NEXT " + window.nexti);
      window.a = a;
      window.b = b;
      console.log(a,b);
      window.nexti++;
    }

    var self = this;
    self.finderObj = {};

    var is = contract(IdentityStorageContract);
    is.setProvider(window.web3.currentProvider);

    is.deployed().then((instance)=>{
      window.ISA = instance;
      var address = this.state.web3.eth.defaultAccount;
      return window.ISA.findByAddress(address);
    }).then((r,e)=>{
      // convert bignum, and redirec tif -1
      var num = parseInt(r);
      if (r == -1){
        //no acc
        this.redirectForCreds(this.auth);
      }
      self.id = r;
      window.exposeForDebug(r,e);
      return window.ISA.getAll(self.id);
    }).then((r,e)=>{
      window.exposeForDebug(r,e);
      self.finderObj.associatedAddress = r[1];
      self.setState({money: parseInt(r[2])});
      console.log(self.id);
      return window.ISA.getSocial(self.id);
    }).then((r,e)=>{
      window.exposeForDebug(r,e);
      console.log(r[0]);

      self.setState({profile:{
        name: r[0]
      }});
      self.setState({updated: true});

      window.userProfile = r;
      // self.showProfile();
      console.log(r,e);
    });
  }

  render() {
    var acc;
    if (this.state.web3 == undefined) {
      if (window.web3 !== undefined) {
        this.setState({web3: window.web3});
      } else {
        this.setState({web3: {eth: null}});
      }
    }
    if (this.state.web3.eth.defaultAccount !== undefined) {
      acc = this.state.web3.eth.defaultAccount;
    } else if (window.web3 !== undefined) {
      acc = window.web3.eth.defaultAccount;
    } else {
      acc = "Err";
    }
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">BIT Auth frontend examples</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Hi and welcome to the BIT auth demo!</h1>
              <p>Lets get to know you. Right now all I know is your metamask address, which is: {acc}</p>

              <button onClick={()=>this.auth()}> Lets find out who you are! </button>
              {this.showProfile()}
              {this.showMoney()}
              {this.showChirp()}
            </div>
          </div>
        </main>
      </div>
    );
  }
}

export default App
