import web3 from "./web3";
import ShareFilesContract from "./build/ShareFileContract.json";
import Address from "../config";
const instance = new web3.eth.Contract(
	JSON.parse(ShareFilesContract.interface),
	Address.shareFileContractAddress
);

export default instance;
