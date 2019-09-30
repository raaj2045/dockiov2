import React, { Component } from "react";
import { Router, Link } from "../routes";
import studentContract from "../ethereum/studentContract";
import web3 from "../ethereum/web3";
import ipfs from "../ipfs";
import certificateAuth from "../ethereum/certificateAuthorityContract";
import { decrypt } from "eciesjs";
import fileType from "@marklb/file-type";
import {
	Container,
	Grid,
	GridRow,
	Card,
	Segment,
	Button,
	Form,
	FormField,
	FormInput,
	Message
} from "semantic-ui-react";

class studentDashboard extends Component {
	state = {
		loading: false,
		files: [],
		accoount: "",
		privateKeySet: false,
		privateKey: "",
		status: "",
		error: ""
	};

	componentDidMount() {}

	getFiles = async () => {
		try {
			const accounts = await web3.eth.getAccounts();
			const count = await studentContract.methods
				.getFileCount(accounts[0])
				.call();

			const files = [];

			const fileCount = Number(count);
			const privateKey = this.state.privateKey;

			for (let index = 0; index < fileCount; index++) {
				this.setState({
					status: `Fetching credential's IPFS hash ${index +
						1} from blockchain...`
				});
				const fileResult = await studentContract.methods
					.getFile(accounts[0], index)
					.call();

				this.setState({
					status: `Fetching credential ${index + 1} from IPFS...`
				});
				const res = await ipfs.get(`/ipfs/${fileResult[0]}`);

				const encryptedFileBuffer = res[0].content;
				this.setState({ status: `Decrypting credential ${index + 1}...` });
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
			this.setState({ files: files, loading: false, status: `` });
		} catch (err) {
			if (err.message === "Unsupported state or unable to authenticate data") {
				this.setState({
					status: ``,
					error: "Invalid key. Please insert the correct private key",
					privateKey: ""
				});
			} else {
				this.setState({ status: ``, error: err.message, privateKey: "" });
			}
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

		return (
			<GridRow>
				Transcripts
				<Card.Group items={items} />
			</GridRow>
		);
	};

	uploadPrivateKey = (e) => {
		this.setState({ error: "" });
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

	render() {
		console.log(this.state.status);
		return (
			<Container>
				<Segment loading={this.state.loading} style={{ padding: "20px 100px" }}>
					<Grid>
						<GridRow style={{ justifyContent: "center" }}>
							<h2>StudentDashboard</h2>
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
							{this.state.error !== "" ? (
								<Message error header='Oops!' content={this.state.error} />
							) : (
								<div />
							)}
						</GridRow>

						<GridRow>{this.renderFileLinks()}</GridRow>

						<GridRow />
						<GridRow style={{ justifyContent: "center" }}>
							<h3>{this.state.status}</h3>
						</GridRow>
						<GridRow>
							<Link route='/student/requests'>
								<Button primary>Check Requests</Button>
							</Link>
						</GridRow>
					</Grid>
				</Segment>
			</Container>
		);
	}
}

export default studentDashboard;
