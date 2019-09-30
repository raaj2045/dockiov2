import React, { Component } from "react";
import { Container, Grid, GridRow, Card, Button } from "semantic-ui-react";
import Layout from "../../components/Layout";
import web3 from "../../ethereum/web3";
import requestContract from "../../ethereum/requestContract";
import { Link } from "../../routes";
class Requests extends Component {
	state = {
		account: "",
		requests: []
	};

	componentDidMount() {
		this.getAccounts();
		this.getRecievedRequests();
	}

	getAccounts = async () => {
		const accounts = await web3.eth.getAccounts();
		this.setState({
			account: accounts[0]
		});
	};

	getRecievedRequests = async () => {
		try {
			const accounts = await web3.eth.getAccounts();
			const count = await requestContract.methods
				.getRecievedRequestCount(accounts[0])
				.call();
			console.log(count);
			const requests = [];
			const requestCount = Number(count);
			for (let index = 0; index < requestCount; index++) {
				const requestResult = await requestContract.methods
					.getRecievedRequest(accounts[0], index)
					.call();
				console.log(requestResult[0]);
				// Request for UI
				const request = {
					description: requestResult[0],
					reciever: requestResult[1],
					sender: requestResult[2],
					hasApproved: requestResult[3]
				};
				requests.push(request);
			}
			this.setState({ requests: requests });
			this.setState({ loading: false });
		} catch (err) {
			console.log(err);
		}
	};

	renderRecievedRequests = () => {
		const requests = this.state.requests;
		const items = requests.map((request, index) => {
			return {
				header: "Request number :" + (index + 1),
				description: (
					<div>
						{request.description}
						<br />
						Sent by : {request.sender}
						<br />
						<Link route={`/student/share/${request.sender}`}>
							<Button>Share</Button>
						</Link>
					</div>
				),
				fluid: true
			};
		});

		return <Card.Group items={items} />;
	};

	render() {
		return (
			<Layout>
				<Grid>
					<GridRow style={{ justifyContent: "center" }}>Requests:</GridRow>
					<GridRow style={{ justifyContent: "center" }}>
						{this.renderRecievedRequests()}
					</GridRow>
				</Grid>
			</Layout>
		);
	}
}

export default Requests;
