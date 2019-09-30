import React, { Component } from "react";
import Layout from "../components/Layout";
import { Grid, GridRow } from "semantic-ui-react";
import web3 from "../ethereum/web3";
import { Router, Link } from "../routes";
class Metamask extends Component {
	async componentDidMount() {
		if (typeof window !== "undefined" && typeof window.web3 !== "undefined") {
			web3.eth.getAccounts(function(err, accounts) {
				if (err != null) console.error("An error occurred: " + err);
				else if (accounts.length == 0) Router.push("/metamask");
				else console.log("User is logged in to MetaMask");
			});
		} else {
			console.log("no metamask");
			Router.push("/metamask");
		}
	}
	render() {
		return (
			<div>
				<Layout>
					<Grid style={{ padding: "50px" }}>
						<GridRow style={{ justifyContent: "center" }}>
							Install metamask or if installed please log in into it.
						</GridRow>
						<GridRow style={{ justifyContent: "center" }}>
							To install Metamask follow this link{" "}
							<a href='https://metamask.io/'>https://metamask.io/</a>
						</GridRow>
						<GridRow style={{ justifyContent: "center" }}>
							If you are done you can proceed <a href='/'>Here</a>
						</GridRow>
					</Grid>
				</Layout>
			</div>
		);
	}
}

export default Metamask;
