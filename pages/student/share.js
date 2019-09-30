import React, { Component } from "react";
import Layout from "../../components/Layout";
import shareFilesContract from "../../ethereum/shareFilesContract";
import {
	Grid,
	GridRow,
	Card,
	Checkbox,
	Form,
	FormField,
	Button,
	FormCheckbox
} from "semantic-ui-react";
import crypto from "crypto";
import ipfs from "../../ipfs";
import certificateAuth from "../../ethereum/certificateAuthorityContract";
import { encrypt, decrypt } from "eciesjs";
import studentContract from "../../ethereum/studentContract";
import web3 from "../../ethereum/web3";
import { Router } from "../../routes";

class SharePage extends Component {
	static getInitialProps(props) {
		return { companyId: props.query.companyId };
	}

	state = {
		loading: false,
		files: [],
		account: "",
		companyId: "",
		fileIndexes: [],
		checkedItems: new Map(),

		privateKeySet: false,
		privateKey: "",
		status: ""
	};

	componentDidMount() {
		this.setState({ companyId: this.props.companyId });
	}

	getFiles = async () => {
		try {
			const accounts = await web3.eth.getAccounts();
			const count = await studentContract.methods
				.getFileCount(accounts[0])
				.call();
			console.log(count);

			const files = [];

			const fileCount = Number(count);
			//Student private key
			const privateKey = this.state.privateKey;
			console.log(privateKey);
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
				const sharedHash = crypto
					.createHash("sha256")
					.update(decryptedFileBuffer)
					.digest("hex");
				const file = {
					ipfsHash: fileResult[0],
					title: fileResult[1],
					description: fileResult[2],
					uploadedOn: String(fileResult[3]),
					originalHash: fileResult[4],
					decryptedFileBuffer: decryptedFileBuffer,
					sharedHash: sharedHash,
					fileIndex: index
				};
				files.push(file);
			}

			this.setState({ files: files });
			this.setState({ loading: false, status: "" });
		} catch (err) {
			this.setState({ loading: false, status: "" });
			console.log(err);
		}
	};

	onChange = (e) => {
		e.preventDefault();
		const item = e.target.name;
		const isChecked = e.target.checked;
		if (this.state.checkedItems.get(item) === undefined) {
			this.setState((prevState) => ({
				checkedItems: prevState.checkedItems.set(item, true)
			}));
		} else {
			this.setState((prevState) => ({
				checkedItems: prevState.checkedItems.set(item, isChecked)
			}));
			console.log(this.state.checkedItems);
		}
	};

	renderFileLinks = () => {
		const files = this.state.files;
		const items = files.map((file, index) => {
			return {
				header: file.title,
				description: (
					<div>
						{file.description}
						<br />
						<input
							name={`box ${+index}`}
							checked={
								this.state.checkedItems.get("box " + index) === undefined
									? false
									: this.state.checkedItems.get("box " + index)
							}
							type='checkbox'
							onChange={this.onChange}
						/>
					</div>
				),
				fluid: true
			};
		});

		return <Card.Group items={items} style={{ maxWidth: "150px" }} />;
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

	//Share button is clicked
	onSubmit = async (e) => {
		e.preventDefault();
		this.setState({ loading: true });
		let fileIndexes = [];
		this.state.checkedItems.forEach((value, key) => {
			if (value) {
				var fileIndex = parseInt(key.slice(3));
				fileIndexes.push(fileIndex);
			}
		});

		// try {
		const accounts = await web3.eth.getAccounts();
		const files = this.state.files;

		var companyId = this.state.companyId;
		this.setState({
			status: "Fetching public key of company from blockchain..."
		});
		const puKey = await certificateAuth.methods.getPublicKey(companyId).call();
		console.log(puKey);
		await (async () => {
			for (let i = 0; i < fileIndexes.length; i++) {
				var file = files[fileIndexes[i]];

				this.setState({
					status: `Checking integrity of credential...`
				});

				if (file.sharedHash === file.originalHash) {
					//original file is reuploaded

					this.setState({
						status: `Encrypting credential ${i +
							1} with company's public key...`
					});
					const encryptedData = encrypt(puKey, file.decryptedFileBuffer);
					this.setState({
						status: `Uploading encrypted credential on IPFS...`
					});
					const result = await ipfs.add(encryptedData);
					this.setState({
						status: `Uploading IPFS hash of encrypted credential on Blockchain...`
					});
					await shareFilesContract.methods
						.uploadFile(
							result[0].hash,
							file.title,
							file.description,
							file.sharedHash,
							companyId,
							accounts[0]
						)

						.send({ from: accounts[0], gas: 3000000 });
				}
			}
		})();
		this.setState({ loading: false, status: "" });
		alert("Files have been shared!");
		Router.push("/");
		// } catch (err) {
		// 	console.log(err);
		// }
	};

	render() {
		return (
			<Layout>
				<Grid>
					<GridRow style={{ justifyContent: "center" }}>
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
					<GridRow style={{ justifyContent: "center" }}>
						<h2>Select File(s) to Share</h2>
					</GridRow>

					<Form onSubmit={this.onSubmit} style={{ width: "100%" }}>
						<GridRow style={{ padding: "10px 50px" }}>
							{this.renderFileLinks()}
						</GridRow>
						<GridRow style={{ textAlign: "center" }}>
							<Button
								loading={this.state.loading}
								type='submit'
								primary
								style={{ marginTop: "20px", marginBottom: "40px" }}>
								Share!
							</Button>
						</GridRow>
						<GridRow style={{ justifyContent: "center", textAlign: "center" }}>
							<h3>{this.state.status}</h3>
						</GridRow>
					</Form>
				</Grid>
			</Layout>
		);
	}
}

export default SharePage;
