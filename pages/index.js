import React, { Component } from "react";
import Layout from "../components/Layout";
import studentContract from "../ethereum/studentContract";
import schoolContract from "../ethereum/schoolContract";
import companyContract from "../ethereum/companyContract";
import web3 from "../ethereum/web3";
import { Router, Link } from "../routes";
import { Segment, Button, Grid, GridRow } from "semantic-ui-react";
import certificateAuth from "../ethereum/certificateAuthorityContract";
class DockioIndex extends Component {
	state = {
		account: "",
		isLoggedIn: "",
		loading: true,
		accountType: ""
	};

	componentDidMount() {
		this.fetchUserDetails();
	}

	fetchUserDetails = async () => {
		try {
			const accounts = await web3.eth.getAccounts();

			const account = accounts[0];

			const studentAccounts = await studentContract.methods
				.getUserAddresses()
				.call();
			const schoolAccounts = await schoolContract.methods
				.getUserAddresses()
				.call();
			const hasStudent = await studentContract.methods
				.hasUser(web3.utils.toChecksumAddress(accounts[0]))
				.call();
			console.log(hasStudent);

			const hasSchool = await schoolContract.methods
				.hasUser(web3.utils.toChecksumAddress(accounts[0]))
				.call();
			console.log(hasSchool);
			const hasCompany = await companyContract.methods
				.hasUser(web3.utils.toChecksumAddress(accounts[0]))
				.call();
			console.log(hasCompany);
			const hasUser = hasStudent || hasSchool || hasCompany;
			this.setState({
				account: account,
				isLoggedIn: hasUser
			});

			const priKey = await certificateAuth.methods
				.getPrivateKey()
				.call({ from: account });
			const pubKey = await certificateAuth.methods.getPublicKey(account).call();
			console.log(pubKey);
			console.log(priKey);

			if (this.state.isLoggedIn) {
				this.setState({ loading: false });
				if (hasSchool) {
					this.setState({ accountType: "School" });
				} else if (hasStudent) {
					this.setState({ accountType: "Student" });
				} else if (hasCompany) {
					this.setState({ accountType: "Company" });
				}
				console.log(this.state);
			} else {
				Router.push("/login");
			}
		} catch (err) {
			console.log(err.message);
		}
	};

	render() {
		return (
			<Layout>
				<Segment loading={this.state.loading}>
					<Grid>
						{" "}
						<GridRow style={{ justifyContent: "center" }}>
							<h3 style={{ textAlign: "center" }}>
								Welcome to the Decentralized Application to Store and Share
								Student Credentials
							</h3>
						</GridRow>
						<GridRow style={{ justifyContent: "center" }}>
							<h3>Account Type : {this.state.accountType}</h3>
						</GridRow>
						<GridRow style={{ justifyContent: "center" }}>
							<h3>You can proceed to your dashboard here</h3>
						</GridRow>
						<GridRow style={{ justifyContent: "center" }}>
							<Link route={`/dashboard/${this.state.accountType}`}>
								<Button>Dashboard</Button>
							</Link>
						</GridRow>
					</Grid>
				</Segment>
			</Layout>
		);
	}
}

export default DockioIndex;
