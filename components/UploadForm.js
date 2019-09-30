import React, { Component } from "react";
import { Router } from "../routes";
import web3 from "../ethereum/web3";
import schoolContract from "../ethereum/schoolContract";
import ipfs from "../ipfs";
import { Grid, Button, Form, GridRow, Segment } from "semantic-ui-react";
import { encrypt } from "eciesjs";
import crypto from "crypto";
import certificateAuth from "../ethereum/certificateAuthorityContract";
class UploadForm extends Component {
	state = {
		studentId: "",
		ipfsHash: null,
		buffer: "",
		account: "",
		description: "",
		loading: false,
		errorMessage: "",
		encryptedData: "",
		originalHash: "",
		status: ""
	};

	componentDidMount() {
		this.getAccounts();
	}

	getAccounts = async () => {
		this.setState({ studentId: this.props.studentId });
		// Save it!
		//bring in user's metamask account address
		const accounts = await web3.eth.getAccounts();
		this.setState({ account: accounts[0] });
	};

	//Take file input from user
	captureFile = (event) => {
		event.stopPropagation();
		event.preventDefault();
		const file = event.target.files[0];
		let reader = new window.FileReader();
		reader.readAsArrayBuffer(file);
		reader.onloadend = () => this.convertToBuffer(reader);
	};

	//Convert the file to buffer to store on IPFS
	convertToBuffer = async (reader) => {
		//file is converted to a buffer for upload to IPFS
		const buffer = await Buffer.from(reader.result);
		//set this buffer-using es6 syntax
		this.setState({ buffer });
	};

	onSubmit = async (event) => {
		event.preventDefault();
		this.setState({ loading: true, errorMessage: "" });
		if (
			confirm(
				"Are you sure you want to upload this file? Changes can't be made after upload"
			)
		) {
			try {
				this.setState({
					status: "Calculating original hash of the credential..."
				});
				const originalHash = crypto
					.createHash("sha256")
					.update(this.state.buffer)
					.digest("hex");

				this.setState({ originalHash });
				this.setState({
					status: "Fetching public key of the student for encryption..."
				});
				const puKey = await certificateAuth.methods
					.getPublicKey(this.state.studentId)
					.call();

				const encryptedData = encrypt(puKey, this.state.buffer);
				this.setState({ status: "Encrypting credential..." });
				this.setState({ encryptedData });

				//save document to IPFS,return its hash#, and set hash# to state
				this.setState({ status: "Uploading encrypted credential on IPFS..." });
				const result = await ipfs.add(this.state.encryptedData);

				this.setState({ ipfsHash: result[0].hash });
				this.setState({
					status:
						"Uploading IPFS hash of the encrypted credential on blockchain..."
				});
				await schoolContract.methods
					.uploadFile(
						this.state.ipfsHash,
						this.state.title,
						this.state.description,
						this.state.studentId,
						this.state.originalHash
					)
					/**Inputs
           *  string _ipfsHash, 
              string _title, 
              string _description,
              address _studentAddress,
              string _originalHash
           * 
           * 
           */
					.send({
						from: this.state.account,
						gas: "300000"
					});
				this.setState({ status: "" });
				this.setState({ loading: false, errorMessage: "" });
				Router.push("/");
			} catch (err) {
				this.setState({ status: "" });
				this.setState({ errorMessage: err.message });
			}
		} else {
			this.setState({ loading: false, errorMessage: "" });
		}
	};

	render() {
		return (
			<Grid style={{ justifyContent: "center", padding: "50px" }}>
				<Segment>
					<GridRow>
						<h5 className='App-header' style={{ textAlign: "center" }}>
							UPLOAD TRANSCRIPT FOR STUDENT <br />
							{this.state.studentId}
						</h5>
					</GridRow>
					<GridRow style={{ padding: "10px" }}>
						<Form onSubmit={this.onSubmit} error={!!this.state.errorMessage}>
							<Form.Field>
								<input
									type='text'
									onChange={(event) => {
										this.setState({ title: event.target.value });
									}}
									placeholder='Title'
								/>
							</Form.Field>
							<Form.Field>
								<input
									type='text'
									onChange={(event) => {
										this.setState({ description: event.target.value });
									}}
									placeholder='Description'
								/>
							</Form.Field>
							<Form.Field>
								<input type='file' onChange={this.captureFile} />
							</Form.Field>
							<Button loading={this.state.loading} primary type='submit'>
								Send it
							</Button>
						</Form>
						<h3 style={{ textAlign: "center" }}>{this.state.status}</h3>
					</GridRow>
				</Segment>
			</Grid>
		);
	}
}

export default UploadForm;
