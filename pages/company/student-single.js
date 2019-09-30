import React, { Component } from "react";
import Layout from "../../components/Layout";
import {
	Button,
	Modal,
	Header,
	Form,
	FormField,
	Grid,
	GridRow,
	Card
} from "semantic-ui-react";
import { Router } from "../../routes";
import requestContract from "../../ethereum/requestContract";
import web3 from "../../ethereum/web3";
import shareFilesContract from "../../ethereum/shareFilesContract";
import ipfs from "../../ipfs";
import certificateAuth from "../../ethereum/certificateAuthorityContract";
import { decrypt } from "eciesjs";
import fileType from "@marklb/file-type";
class StudentSingle extends Component {
	static getInitialProps(props) {
		return {
			studentId: props.query.address,
			companyId: props.query.companyAddress
		};
	}
	state = {
		account: "",
		studentAddress: "",
		description: "",
		requests: [],
		files: [],
		privateKeySet: false,
		privateKey: "",
		value: "",
		status: ""
	};

	componentDidMount() {
		this.getAccounts();
		this.getSentRequests();
	}

	getFiles = async () => {
		try {
			const accounts = await web3.eth.getAccounts();
			const count = await shareFilesContract.methods
				.getFileCount(accounts[0], this.state.studentAddress)
				.call();

			console.log(count);

			const files = [];

			const fileCount = Number(count);
			const privateKey = this.state.privateKey;
			console.log(privateKey);
			for (let index = 0; index < fileCount; index++) {
				this.setState({
					status: `Fetching IPFS hash of credential ${index +
						1} from blockchain...`
				});
				const fileResult = await shareFilesContract.methods
					.getFile(accounts[0], this.state.studentAddress, index)
					.call();

				this.setState({
					status: `Fetching credential ${index + 1} from IPFS...`
				});
				const res = await ipfs.get(`/ipfs/${fileResult[0]}`);

				const encryptedFileBuffer = res[0].content;
				this.setState({ status: `Decrypting credential ${index + 1}` });
				const decryptedFileBuffer = decrypt(privateKey, encryptedFileBuffer);
				const info = fileType(decryptedFileBuffer);

				const file = {
					ipfsHash: fileResult[0],
					title: fileResult[1],
					description: fileResult[2],
					uploadedOn: String(fileResult[3]),
					decryptedFileBuffer: decryptedFileBuffer,
					fileType: info
				};
				files.push(file);
			}
			this.setState({ files: files, loading: false, status: "" });
		} catch (err) {
			this.setState({ status: "" });
			console.log(err.message);
		}
	};

	renderFileLinks = () => {
		const files = this.state.files;
		const items = files.map((file) => {
			return {
				header: file.title,
				description: (
					<div>
						{file.description}
						<a
							href='#'
							onClick={() => {
								var blob = new Blob([file.decryptedFileBuffer], {
									type: file.fileType
								});
								var link = document.createElement("a");
								link.href = window.URL.createObjectURL(blob);

								link.download = file.title + "." + file.fileType.ext;
								link.click();
							}}>
							<br />
							Link of file
						</a>
					</div>
				),
				fluid: true
			};
		});

		return <Card.Group items={items} />;
	};

	uploadPrivateKey = (e) => {
		let file = e.target.files[0];
		let reader = new window.FileReader();
		reader.readAsArrayBuffer(file);
		reader.onloadend = () => this.convertToBuffer(reader);
	};

	//Convert the file to buffer to store on IPFS
	convertToBuffer = async (reader) => {
		//file is converted to a buffer for upload to IPFS
		const buffer = await Buffer.from(reader.result);
		//set this buffer-using es6 syntax

		console.log(buffer.toString());
		this.setState({ privateKeySet: true, privateKey: buffer.toString() });
		this.getFiles();
	};

	getAccounts = async () => {
		const accounts = await web3.eth.getAccounts();
		this.setState({
			account: accounts[0],
			studentAddress: this.props.studentId
		});
		console.log(this.state);
		if (this.props.companyId != this.state.account) {
			Router.push("/");
		}
	};

	onSubmit = async (e) => {
		e.preventDefault();
		const { account, studentAddress, description } = this.state;
		try {
			await requestContract.methods
				.sendRequest(studentAddress, description)
				.send({ from: account, gas: "300000" });
			alert("Request Sent");
			Router.push("/");
		} catch (err) {
			console.log(err);
		}
	};

	getSentRequests = async () => {
		try {
			const accounts = await web3.eth.getAccounts();
			const count = await requestContract.methods
				.getSentRequestsCount(accounts[0])
				.call();
			const requests = [];
			const requestCount = Number(count);
			for (let index = 0; index < requestCount; index++) {
				const requestResult = await requestContract.methods
					.getSentRequest(accounts[0], index)
					.call();

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

	renderSentRequests = () => {
		const requests = this.state.requests;
		const items = requests.map((request, index) => {
			return {
				header: "Request number :" + (index + 1),
				description: <div>{request.description}</div>,
				fluid: true
			};
		});

		return <Card.Group items={items} />;
	};

	render() {
		return (
			<Layout>
				<Grid style={{ padding: "50px" }}>
					<GridRow style={{ justifyContent: "center" }}>
						<h4> Student ID : {this.state.studentAddress}</h4>
					</GridRow>
					<GridRow>
						<Form>
							<FormField>
								<label htmlFor='Private Key'>
									Insert your private key to get credentials
								</label>
								<input
									disabled={this.state.privateKey}
									type='file'
									onChange={this.uploadPrivateKey}
								/>
							</FormField>
						</Form>
					</GridRow>
					<GridRow>
						<div>Shared transcripts : </div>
					</GridRow>
					<GridRow>{this.renderFileLinks()}</GridRow>

					<GridRow>
						<Modal trigger={<Button primary>Request for transcripts</Button>}>
							<Header>Request</Header>
							<Modal.Content>
								<Form onSubmit={this.onSubmit}>
									<FormField>
										<label>Description</label>
										<input
											onChange={(e) => {
												this.setState({ description: e.target.value });
											}}
											placeholder='description'
										/>
									</FormField>
									<Button type='submit'>Send Request</Button>
								</Form>
							</Modal.Content>
						</Modal>
					</GridRow>
					<GridRow style={{ justifyContent: "center" }}>
						<h3>{this.state.status}</h3>
					</GridRow>
					<GridRow>
						<h4>Previous Requests:</h4>
					</GridRow>
					<GridRow>{this.renderSentRequests()}</GridRow>
				</Grid>
			</Layout>
		);
	}
}

export default StudentSingle;
