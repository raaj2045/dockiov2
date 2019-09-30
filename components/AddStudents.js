import React, { Component } from "react";
import { Form, Input, Button, Message } from "semantic-ui-react";
import schoolContract from "../ethereum/schoolContract";
import { Router } from "../routes";
import web3 from "../ethereum/web3";
class AddStudents extends Component {
	state = {
		account: "",
		studentAccount: "",
		loading: false,
		errorMessage: ""
	};

	componentDidMount() {
		this.getAccounts();
	}

	getAccounts = async () => {
		const accounts = await web3.eth.getAccounts();
		this.setState({ account: accounts[0] });
	};

	onSubmit = async (e) => {
		e.preventDefault();
		console.log(this.state);
		this.setState({ loading: true, errorMessage: "" });
		try {
			await schoolContract.methods
				.addStudent(this.state.studentAccount)
				.send({ from: this.state.account, gas: "300000" });
			this.setState({ loading: false, errorMessage: "" });
			Router.push("/");
		} catch (err) {
			this.setState({ errorMessage: err.message, loading: false });
		}
	};

	render() {
		return (
			<div>
				<h4>Add Students here!</h4>
				<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
					<Form.Field>
						<Input
							onChange={(e) => {
								this.setState({ studentAccount: e.target.value });
							}}
							value={this.state.studentAccount}
							label='Account Address'
							placeholder='0x...'
						/>
					</Form.Field>
					<Message error header='Oops!' content={this.state.errorMessage} />
					<Button loading={this.state.loading} type='submit' primary>
						Add
					</Button>
				</Form>
			</div>
		);
	}
}

export default AddStudents;
