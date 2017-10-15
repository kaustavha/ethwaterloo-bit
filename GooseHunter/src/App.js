import React, { Component } from 'react'
import SimpleStorageContract from '../build/contracts/SimpleStorage.json'
// import getWeb3 from './utils/getWeb3'
import IdentityStorageContract from '../build/contracts/IdentityStorage.json'
const contract = require('truffle-contract');
// const ISA = contract(IdentityStorageContract);
// const address = window.web3.eth.defaultAccount;
import ghjson from '../build/contracts/GooseHunter.json';

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
      self.id = r;
      window.exposeForDebug(r,e);
      return window.ISA.getAll(self.id);
    }).then((r,e)=>{
      window.exposeForDebug(r,e);
      self.finderObj.associatedAddress = r[1];
      self.setState({money: r[2].toNumber()});
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
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">BIT Auth frontend examples</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Hi and welcome to the BIT auth demo!</h1>
              <p>Lets get to know you. Right now all I know is your metamask address, which is: {window.web3.eth.defaultAccount}</p>

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
