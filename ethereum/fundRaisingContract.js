import web3 from "./web3";
import Address from "../config";
import FundRaisingContract from "../ethereum/build/FundRaising.json";
const instance = new web3.eth.Contract(
	JSON.parse(FundRaisingContract.interface),
	Address.fundRaisingContract
);

export default instance;
