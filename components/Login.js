import React, { Component } from "react";
import {
	Button,
	Form,
	Grid,
	Header,
	Card,
	Segment,
	Message
} from "semantic-ui-react";
import certificateAuth from "../ethereum/certificateAuthorityContract";
const PrivateKey = require("eciesjs").PrivateKey;
import studentContract from "../ethereum/studentContract";
import schoolContract from "../ethereum/schoolContract";
import companyContract from "../ethereum/companyContract";
import web3 from "../ethereum/web3";
import { Router } from "../routes";

const options = [
	{ key: "student", value: "student", text: "Student" },
	{ key: "school", value: "school", text: "School" },
	{ key: "company", value: "company", text: "Company" }
];

class Login extends Component {
	state = {
		name: "",
		designation: "",
		errorMessage: "",
		account: "",
		loading: false
	};

	componentDidMount() {
		this.getAccounts();
	}

	getAccounts = async () => {
		const accounts = await web3.eth.getAccounts();
		this.setState({ account: accounts[0] });
	};

	download = (filename, text) => {
		var element = document.createElement("a");
		element.setAttribute(
			"href",
			"data:text/plain;charset=utf-8," + encodeURIComponent(text)
		);
		element.setAttribute("download", filename);

		element.style.display = "none";
		document.body.appendChild(element);

		element.click();

		document.body.removeChild(element);
	};

	onSubmit = async (event) => {
		event.preventDefault();
		var key = new PrivateKey();
		var prKey = key.toHex();
		var puKey = key.publicKey.toHex();
		this.setState({ loading: true, errorMessage: "" });
		if (this.state.designation === "student") {
			try {
				var tx1 = await studentContract.methods
					.createUser(this.state.name, this.state.designation)
					.send({
						from: this.state.account
					})
					.catch((err) => console.log(err));
				// await certificateAuth.methods
				// 	.setPrivateKey(prKey)
				// 	.send({ from: this.state.account });
				console.log(tx1);
				var tx2 = await certificateAuth.methods
					.setPublicKey(puKey)
					.send({ from: this.state.account });
				console.log(tx2);
				this.download("privateKeyStudent.txt", prKey);
				alert(
					"You have been successfully registered!\n Your public key is uploaded on the blockchain and private key has been downloaded (keep it safe)"
				);
				this.setState({ loading: false, errorMessage: "" });
				Router.push("/");
			} catch (err) {
				this.setState({ errorMessage: err.message });
			}
		} else if (this.state.designation === "school") {
			try {
				await schoolContract.methods
					.createUser(this.state.name, this.state.designation)
					.send({
						from: this.state.account
					});

				await certificateAuth.methods
					.setPublicKey(puKey)
					.send({ from: this.state.account });

				this.download("privateKeySchool.txt", prKey);
				alert(
					"You have been successfully registered!\n Your public key is uploaded on the blockchain and private key has been downloaded (keep it safe)"
				);
				this.setState({ loading: false, errorMessage: "" });
				Router.push("/");
			} catch (err) {
				console.log(err.message);
				this.setState({ errorMessage: err.message });
			}
		} else if (this.state.designation === "company") {
			try {
				await companyContract.methods
					.createUser(this.state.name, this.state.designation)
					.send({
						from: this.state.account
					});

				await certificateAuth.methods
					.setPublicKey(puKey)
					.send({ from: this.state.account });

				this.download("privateKeyCompany.txt", prKey);
				alert(
					"You have been successfully registered!\n Your public key is uploaded on the blockchain and private key has been downloaded (keep it safe)"
				);
				this.setState({ loading: false, errorMessage: "" });
				Router.push("/");
			} catch (err) {
				console.log(err);
				this.setState({ errorMessage: err.message });
			}
		}
	};

	render() {
		return (
			<div className='login-form'>
				<Grid textAlign='center' verticalAlign='middle'>
					<Grid.Column style={{ maxWidth: 450 }}>
						<Header as='h2' color='teal' textAlign='center'>
							Sign-up to continue
						</Header>
						<Form
							size='large'
							onSubmit={this.onSubmit}
							error={!!this.state.errorMessage}>
							<Segment stacked>
								<Card.Group>
									<Card
										style={{ fontSize: "11px", marginBottom: "50px" }}
										fluid
										header='Account id'
										description={this.state.account}
									/>
								</Card.Group>
								<Form.Input
									fluid
									icon='user'
									iconPosition='left'
									value={this.state.name}
									onChange={(event) =>
										this.setState({ name: event.target.value })
									}
									placeholder='Name'
								/>
								<Form.Select
									value={this.state.designation}
									onChange={(e, { value }) =>
										this.setState({ designation: value })
									}
									placeholder='Designation'
									options={options}
								/>
								<Message
									error
									header='Oops!'
									content={this.state.errorMessage}
								/>
								<Button
									loading={this.state.loading}
									color='purple'
									fluid
									size='large'>
									Sign In
								</Button>
							</Segment>
						</Form>
					</Grid.Column>
				</Grid>
			</div>
		);
	}
}

export default Login;
