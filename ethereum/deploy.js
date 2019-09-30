const HDWalletProvider = require("truffle-hdwallet-provider");
const Web3 = require("web3");
const compiledUserContract = require("../ethereum/build/UserContract.json");
const compiledFileContract = require("../ethereum/build/FileContract.json");
const compiledStudentContract = require("../ethereum/build/StudentContract.json");
const compiledSchoolContract = require("../ethereum/build/SchoolContract.json");
const compiledRequestContract = require("../ethereum/build/RequestContract.json");
const compiledCompanyContract = require("../ethereum/build/CompanyContract.json");
const compiledShareFileContract = require("../ethereum/build/ShareFileContract.json");
const compiledCertificateAuthorityContract = require("../ethereum/build/CertificateAuthority.json");
const compiledFundRaisingContract = require("../ethereum/build/FundRaising.json");
const compiledShareFileIndexContract = require("../ethereum/build/ShareFileIndexContract.json");
const provider = new HDWalletProvider(
	"arch piece seat curtain fitness tunnel oblige upper news execute lesson bounce",
	"https://rinkeby.infura.io/v3/04280dc3e8a2405db2111ac4490d86be"
);

const web3 = new Web3(provider);

const deploy = async () => {
	const accounts = await web3.eth.getAccounts();
	console.log("Attempting to deploy from account", accounts[0]);

	const UserContract = await new web3.eth.Contract(
		JSON.parse(compiledUserContract.interface)
	)
		.deploy({ data: compiledUserContract.bytecode })
		.send({ from: accounts[0], gas: "4000000" });
	console.log("Usercontract deployed at " + UserContract.options.address);

	const ShareFileContract = await new web3.eth.Contract(
		JSON.parse(compiledShareFileContract.interface)
	)
		.deploy({ data: compiledShareFileContract.bytecode })
		.send({ from: accounts[0], gas: "4000000" });
	console.log(
		"ShareFile Contract is deployed at " + ShareFileContract.options.address
	);

	const CertificateAuthorityContract = await new web3.eth.Contract(
		JSON.parse(compiledCertificateAuthorityContract.interface)
	)
		.deploy({ data: compiledCertificateAuthorityContract.bytecode })
		.send({ from: accounts[0], gas: "4000000" });
	console.log(
		"CertificateAuthority Contract is deployed at " +
			CertificateAuthorityContract.options.address
	);

	const FundRaisingContract = await new web3.eth.Contract(
		JSON.parse(compiledFundRaisingContract.interface)
	)
		.deploy({ data: compiledFundRaisingContract.bytecode })
		.send({ from: accounts[0], gas: "4000000" });
	console.log(
		"FundRaisingContract deployed at " + FundRaisingContract.options.address
	);

	FileContract = await new web3.eth.Contract(
		JSON.parse(compiledFileContract.interface)
	)
		.deploy({ data: compiledFileContract.bytecode })
		.send({ from: accounts[0], gas: "4000000" });

	console.log("Filecontract deployed at " + FileContract.options.address);

	StudentContract = await new web3.eth.Contract(
		JSON.parse(compiledStudentContract.interface)
	)
		.deploy({
			data: compiledStudentContract.bytecode,
			arguments: [FileContract.options.address]
		})
		.send({ from: accounts[0], gas: "3000000" });
	console.log("Studentcontract deployed at " + StudentContract.options.address);

	SchoolContract = await new web3.eth.Contract(
		JSON.parse(compiledSchoolContract.interface)
	)
		.deploy({
			data: compiledSchoolContract.bytecode,
			arguments: [FileContract.options.address, StudentContract.options.address]
		})
		.send({ from: accounts[0], gas: "4000000" });

	console.log("Schoolcontract deployed at " + SchoolContract.options.address);

	RequestContract = await new web3.eth.Contract(
		JSON.parse(compiledRequestContract.interface)
	)
		.deploy({ data: compiledRequestContract.bytecode })
		.send({ from: accounts[0], gas: "4000000" });

	console.log(
		"Request Contract deployed at " + RequestContract.options.address
	);

	CompanyContract = await new web3.eth.Contract(
		JSON.parse(compiledCompanyContract.interface)
	)
		.deploy({
			data: compiledCompanyContract.bytecode,
			arguments: [FileContract.options.address, SchoolContract.options.address]
		})
		.send({ from: accounts[0], gas: "4000000" });

	console.log("CompanyContract deployed at " + CompanyContract.options.address);
};

deploy();
