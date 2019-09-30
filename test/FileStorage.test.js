// const assert = require("assert");
// const ganache = require("ganache-cli");
// const web3 = new Web3(ganache.provider());

var fs = require("fs");

const encrypt = require("eciesjs").encrypt;

const PrivateKey = require("eciesjs").PrivateKey;
const Web3 = require("web3");
const HDWalletProvider = require("truffle-hdwallet-provider");
const compiledUserContract = require("../ethereum/build/UserContract.json");
const compiledStudentContract = require("../ethereum/build/StudentContract.json");
const compiledSchoolContract = require("../ethereum/build/SchoolContract.json");
const compiledRequestContract = require("../ethereum/build/RequestContract.json");
const compiledCompanyContract = require("../ethereum/build/CompanyContract.json");
const compiledShareFileIndexContract = require("../ethereum/build/ShareFileIndexContract.json");
const compiledFileContract = require("../ethereum/build/FileContract.json");
const compiledShareFileContract = require("../ethereum/build/ShareFileContract.json");
const provider = new HDWalletProvider(
	"arch piece seat curtain fitness tunnel oblige upper news execute lesson bounce",
	"https://rinkeby.infura.io/v3/04280dc3e8a2405db2111ac4490d86be"
);
const Address = require("../config.test");
const IPFS = require("ipfs-api");
const ipfs = new IPFS({
	host: "ipfs.infura.io",
	port: 5001,
	protocol: "https"
});
const crypto = require("crypto");
const web3 = new Web3(provider);
let accounts;
let FileContract;

beforeEach(async () => {
	try {
		accounts = await web3.eth.getAccounts();

		// UserContract = await new web3.eth.Contract(
		//   JSON.parse(compiledUserContract.interface),
		//   Address.userContractAddress
		// );

		FileContract = new web3.eth.Contract(
			JSON.parse(compiledFileContract.interface),
			Address.fileContractAddress
		);

		RequestContract = await new web3.eth.Contract(
			JSON.parse(compiledRequestContract.interface),
			Address.requestContractAddress
		);

		ShareFileContract = await new web3.eth.Contract(
			JSON.parse(compiledShareFileContract.interface),
			Address.shareFileContractAddress
		);

		ShareFileIndexContract = await new web3.eth.Contract(
			JSON.parse(compiledShareFileIndexContract.interface),
			Address.shareFileIndexContract
		);
	} catch (err) {
		// StudentContract = await new web3.eth.Contract(
		//   JSON.parse(compiledStudentContract.interface),
		//   Address.studentContractAddress
		// );

		// console.log(StudentContract.options.address);

		// SchoolContract = await new web3.eth.Contract(
		//   JSON.parse(compiledSchoolContract.interface),
		//   Address.schoolContractAddress
		// );

		// CompanyContract = await new web3.eth.Contract(
		//   JSON.parse(compiledCompanyContract.interface),
		//   Address.companyContractAddress
		// );
		console.log(err.message);
	}
});

describe("Testing response time", () => {
	/**----------------------------
------TESTING FOR FILE UPLOAD------
 ----------------------------------*/
	// it("measure time taken to upload a file", async () => {
	// 	try {
	// 		for (var i = 0; i < 100; i++) {
	// 			var start = new Date().getTime();
	// 			const file = Buffer.from(
	// 				"kndafpknsd'gksdpkgndf'pshnkpsnfhpbfmsgohmsf[]ohmsdmfh[asmdh[smd[gomsdvo[vsd"
	// 			);
	// 			// const key = new PrivateKey();
	// 			// const encryptedFile = encrypt(key.publicKey.toHex(), file);

	// 			const res = await ipfs.add(file);
	// 			// const hash = crypto
	// 			// 	.createHash("sha256")
	// 			// 	.update(file)
	// 			// 	.digest("hex");
	// 			const txId = await FileContract.methods
	// 				.uploadFile(
	// 					res[0].hash,
	// 					"demo",
	// 					"demo",
	// 					"0xca35b7d915458ef540ade6068dfe2f44e8fa733d",
	// 					""
	// 				)
	// 				.send({ from: accounts[0], gas: 3000000 });

	// 			var end = new Date().getTime();
	// 			var time = end - start;
	// 			console.log(time);
	// 		}
	// 	} catch (err) {
	// 		console.log(err.message);
	// 	}
	// });

	/**-------------------------------
  ------TESTING FOR SHARING---------
  ----------------------------------*/
	//----------------------------------------PIPELINE----------------------------------------------//
	//----METHOD FOR REQUEST SENDING --> sendRequest(address _reciever,string _description)------------------//
	//----METHOD FOR SHARING --> shareFileIndex(address _companyAddress,uint[] _fileIndexes ) FILE SHARING---//
	//-------------------------------------------------------------------------------------------------------//
	// it("get time to share a file", async () => {
	// 	for (var i = 0; i < 100; i++) {
	// 		var start = new Date().getTime();

	// 		const txId1 = await RequestContract.methods
	// 			.sendRequest("0xca35b7d915458ef540ade6068dfe2f44e8fa733d", "demo")
	// 			.send({ from: accounts[0], gas: 3000000 });

	// 		const txId2 = await ShareFileIndexContract.methods
	// 			.shareFileIndex("0xca35b7d915458ef540ade6068dfe2f44e8fa733d", [
	// 				1,
	// 				2,
	// 				3,
	// 				4,
	// 				5
	// 			])
	// 			.send({ from: accounts[0], gas: 3000000 });

	// 		var end = new Date().getTime();
	// 		var time = end - start;
	// 		console.log(time);
	// 	}
	// });
	/**-------------------------------
  ------AFTER SECURITY---------
  ----------------------------------*/

	it("get time to share a file", async () => {
		for (var i = 0; i < 100; i++) {
			var start = new Date().getTime();

			const txId1 = await RequestContract.methods
				.sendRequest("0xca35b7d915458ef540ade6068dfe2f44e8fa733d", "demo")
				.send({ from: accounts[0] });

			const file = Buffer.from(
				"kndafpknsd'gksdpkgndf'pshnkpsnfhpbfmsgohmsf[]ohmsdmfh[asmdh[smd[gomsdvo[vsd"
			);
			// const key = new PrivateKey();
			// const encryptedFile = encrypt(key.publicKey.toHex(), file);

			const res = await ipfs.add(file);
			// const hash = crypto
			// 	.createHash("sha256")
			// 	.update(file)
			// 	.digest("hex");

			var t = await ShareFileContract.methods
				.uploadFile(
					res[0].hash,
					"demoaaaaaaaaaaaaaaaa",
					"demoaaaaaaaaaaaaaaaa",
					"",
					"0x3971290d592b9a3650119b20154ebfb9b9748e0d",
					"0x14723a09acff6d2a60dcdf7aa4aff308fddc160c"
				)

				.send({ from: accounts[0] });

			var end = new Date().getTime();
			var time = end - start;
			console.log(time);
		}
	});
});
