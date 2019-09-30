import web3 from "./web3";
import Address from "../config";
import ShareFileIndexContract from "../ethereum/build/ShareFileIndexContract.json";
const instance = new web3.eth.Contract(
	JSON.parse(ShareFileIndexContract.interface),
	Address.shareFileIndexContractAddress
);

export default instance;
