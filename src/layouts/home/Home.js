import React, { Component } from 'react'

import LoginButtonContainer from './../../user/ui/loginbutton/LoginButtonContainer'

class Home extends Component {
  render() {
    const OnlyGuestLinks = () =>
      <span>
        <LoginButtonContainer />
      </span>

    return(
			<div className="wrapper">
				<div className="container">
					<div>
						<div id="app">
							<h1>Welcome to BIT</h1>
							<h4>An ETHWaterloo Project</h4>

							<p>Let's start migrating your identity to the Blockchain.</p>

							<h3>Web 3.0 Target</h3>
							<table>
								<tbody>
									<tr>
										<td><img src="img/metamask.png" width="80" role="presentation" /> MetaMask<br /><br /></td>
									</tr>
								</tbody>
							</table>

							<h3>Web 2.0 Service Provider(s)</h3>
							<table>
								<tbody>
									<tr>
										<td><OnlyGuestLinks /><br /><br /></td>
									</tr>
								</tbody>
							</table>

							<h3>Web 3.0 Service Provider(s)</h3>
							<table>
								<tbody>
									<tr onClick={this.coming_soon}>
										<td><img src="img/toshi.png"  width="80" role="presentation" /> Login with Toshi<br /><br /></td>
									</tr>
								</tbody>
							</table>
						</div>
					</div>
				</div>
			</div>
    )
  }
}

export default Home
