import React, { Component } from "react";
import companyContract from "../ethereum/companyContract";
import web3 from "../ethereum/web3";
import { Link } from "../routes";
import { Card, Container, GridRow, Header, Grid } from "semantic-ui-react";

class CompanyDashboard extends Component {
	state = {
		loading: true,
		account: "",
		schools: []
	};

	componentDidMount() {
		this.getSchools();
	}

	getSchools = async () => {
		try {
			const accounts = await web3.eth.getAccounts();
			const schools = await companyContract.methods.getSchoolAddresses().call();
			this.setState({ schools: schools, account: accounts[0] });
		} catch (err) {
			console.log(err.message);
		}
	};

	renderSchools = () => {
		const schools = this.state.schools;
		const companyAddress = this.state.account;

		const items = schools.map((address) => {
			return {
				header: address,
				description: (
					<Link route={`/company/${companyAddress}/${address}`}>
						<a>View Students</a>
					</Link>
				),
				fluid: true
			};
		});

		return <Card.Group items={items} />;
	};

	render() {
		return (
			<Container>
				<Grid>
					<GridRow style={{ justifyContent: "center" }}>
						<h3>Schools Linked to the Blockchain</h3>
					</GridRow>
					<GridRow style={{ justifyContent: "center" }}>
						<div>{this.renderSchools()}</div>
					</GridRow>
				</Grid>
			</Container>
		);
	}
}

export default CompanyDashboard;
