import React, { Component } from 'react'

class Dashboard extends Component {
  constructor(props, { authData }) {
    super(props)
    // authdata is all the obj we got from fb

    authData = this.props
  }

  storeOnChain(user) {
    // e.preventDefault();
    console.log(user);
    console.log("store on chain");
    // console.log(this.props.authData);
  }
  render() {
    return(
      <main className="container">
        <div className="pure-g">
          <div className="pure-u-1-1">
            <h1>Dashboard</h1>
            <p><strong>Congratulations {this.props.authData.name}!</strong> If you're seeing this page, you've logged in with Facebook successfully.</p>
            <button onClick={()=>this.storeOnChain(this.props.authData)}> Click here to upload your identitiy to the blockchain </button>
          </div>
        </div>
      </main>
    )
  }
}

export default Dashboard
